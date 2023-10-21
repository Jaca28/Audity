// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./DataStructure.sol";

contract BlockData is AccessControl, Pausable, Ownable {
    ///@dev Roles definition.
    bytes32 public constant masterRole = keccak256("masterRole");

    ///@dev variables
    uint256 public ID;
    uint256 public aRegisterRequest; //Accepted register request
    uint256 public dRegisterRequest; //Declined register request

    ///@dev mappings
    mapping(uint => mapping(uint => string)) public projectRequirementName;
    mapping(uint => uint) public projectRequirementCount; // Count of setted requirements
    mapping(uint => mapping(uint => DataStructure.RequirementState))
        public projectRequirementState;
    mapping(uint => mapping(uint => address[])) public projectRequirementMakers; //Requirement MAKERS list
    mapping(uint => mapping(uint => address[])) public projectRequirementRevs; //Requirement REVIEWERS list
    mapping(uint => mapping(uint => address[])) public projectRequirementApps; //Requirement APPROVERS list
    mapping(uint => mapping(uint => string[3])) public projectRequirementHash; //[MADE, REVIEWED, APPROVED] Actual hash
    mapping(uint => mapping(uint => string[])) public requirementMadeHis; //MADE History hash
    mapping(uint => mapping(uint => uint[])) public requirementMadeHisDate; //MADE History date
    mapping(uint => mapping(uint => address[])) public requirementMadeHisAddr; //MADE History Address
    mapping(string => uint[2]) public hashToRequirements;
    mapping(address => uint[]) public projectsByUser; //user address to project ID
    mapping(uint => mapping(uint => string[])) public requirementRevHis; //REVIEWED History hash
    mapping(uint => mapping(uint => uint[])) public requirementRevHisDate; //REVIEWED History date
    mapping(uint => mapping(uint => address[])) public requirementRevHisAddr; //REVIEWED History Address
    mapping(uint => mapping(uint => string[])) public requirementAppHis; //APPROVED History hash
    mapping(uint => mapping(uint => uint[])) public requirementAppHisDate; //APPROVED History date
    mapping(uint => mapping(uint => address[])) public requirementAppHisAddr; //APPROVED History Address
    mapping(uint => uint256) public requestAttend; //0=unattended, 1=Aproved, 2=Declined

    ///@dev structs
    DataStructure.Project[] public projects;
    DataStructure.RegisterRequest[] public registerRequests;

    ///@dev contract functions
    constructor() Ownable() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        ID = 1;
    }

    ///@dev modifiers
    modifier hasMasterRole() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(masterRole, msg.sender),
            "Caller is not authorized"
        );
        _;
    }

    ///@dev create a project
    function setProject(
        DataStructure.Project memory project
    ) public whenNotPaused hasMasterRole {
        project.idProject = ID;
        setProjectNumber(project.adminAddr, ID);
        projects.push(project);
        ID += 1;
    }

    //@dev gives an ID to a project
    function setProjectNumber(address _user, uint256 _id) internal virtual {
        uint256[] storage IdProjects;
        IdProjects = projectsByUser[_user];
        IdProjects.push(_id);
    }

    ///@dev create a project requirement - gives ID and set name
    function setProjectRequirement(
        uint256 _projectId,
        string memory _nameRequirement,
        address _projectAdminAddr
    ) public whenNotPaused hasMasterRole {
        DataStructure.Project memory project = getProject(_projectId - 1);
        require(
            project.state != DataStructure.ProjectState.CLOSED,
            "El proyecto ya ha sido cerrado"
        );
        projectRequirementCount[_projectId] =
            projectRequirementCount[_projectId] +
            1;
        uint256 requirementId = projectRequirementCount[_projectId];
        projectRequirementName[_projectId][requirementId] = _nameRequirement;
        projectRequirementState[_projectId][requirementId] = DataStructure
            .RequirementState
            .CREATED;
        address[] storage makersList;
        makersList = projectRequirementMakers[_projectId][requirementId];
        makersList.push(_projectAdminAddr);
        address[] storage reviewerList;
        reviewerList = projectRequirementRevs[_projectId][requirementId];
        reviewerList.push(_projectAdminAddr);
        address[] storage approverList;
        approverList = projectRequirementApps[_projectId][requirementId];
        approverList.push(_projectAdminAddr);
        if (projectRequirementCount[_projectId] >= project.requirements) {
            project.requirements = projectRequirementCount[_projectId];
            updateProject(_projectId, project);
        }
        project.state = DataStructure.ProjectState.INPROCESS;
        updateProject(_projectId, project);
    }

    ///@dev add maker for an specific project requirement
    function closeProject(
        uint256 _projectId
    ) public whenNotPaused hasMasterRole {
        DataStructure.Project memory project = getProject(_projectId - 1);
        require(
            project.state != DataStructure.ProjectState.CLOSED,
            "The project has been closed"
        );
        project.state = DataStructure.ProjectState.CLOSED;
        updateProject(_projectId, project);
    }

    ///@dev add maker for an specific project requirement
    function setMaker(
        uint256 _projectId,
        uint256 _requirementId,
        address _makerAddr
    ) public whenNotPaused hasMasterRole {
        setProjectNumber(_makerAddr, _projectId);
        address[] storage makersList;
        makersList = projectRequirementMakers[_projectId][_requirementId];
        makersList.push(_makerAddr);
    }

    ///@dev add reviewer for an specific project requirement
    function setReviewer(
        uint256 _projectId,
        uint256 _requirementId,
        address _reviewerAddr
    ) public whenNotPaused hasMasterRole {
        setProjectNumber(_reviewerAddr, _projectId);
        address[] storage reviewerList;
        reviewerList = projectRequirementRevs[_projectId][_requirementId];
        reviewerList.push(_reviewerAddr);
    }

    ///@dev add approver for an specific project requirement
    function setApprover(
        uint256 _projectId,
        uint256 _requirementId,
        address _approverAddr
    ) public whenNotPaused hasMasterRole {
        setProjectNumber(_approverAddr, _projectId);
        address[] storage approverList;
        approverList = projectRequirementApps[_projectId][_requirementId];
        approverList.push(_approverAddr);
    }

    ///@dev set requirement as made
    function setMadeRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash,
        address _maker
    ) public whenNotPaused hasMasterRole {
        string[] storage madeHis;
        uint256[] storage madeDateHis;
        address[] storage madeAddrHis;
        DataStructure.Project memory project = getProject(_projectId - 1);
        require(
            project.state != DataStructure.ProjectState.CLOSED,
            "El proyecto ya ha sido cerrado"
        );
        projectRequirementHash[_projectId][_requirementId][
            0
        ] = _requirementHash;
        madeHis = requirementMadeHis[_projectId][_requirementId];
        madeHis.push(_requirementHash);
        madeDateHis = requirementMadeHisDate[_projectId][_requirementId];
        uint256 time = block.timestamp;
        madeDateHis.push(time);
        madeAddrHis = requirementMadeHisAddr[_projectId][_requirementId];
        madeAddrHis.push(_maker);
        project.lastUpdate = time;
        hashToRequirements[_requirementHash][0] = _projectId;
        hashToRequirements[_requirementHash][1] = _requirementId;
        projects[_projectId - 1] = project;
        projectRequirementState[_projectId][_requirementId] = DataStructure
            .RequirementState
            .MADE;
    }

    ///@dev set requirement as reviewed
    function setReviewedRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash,
        address _reviewer
    ) public whenNotPaused hasMasterRole {
        string[] storage revHis;
        uint256[] storage revDateHis;
        address[] storage revAddrHis;
        DataStructure.Project memory project = getProject(_projectId - 1);
        require(
            project.state != DataStructure.ProjectState.CLOSED,
            "El proyecto ya ha sido cerrado"
        );
        projectRequirementHash[_projectId][_requirementId][
            1
        ] = _requirementHash;
        revHis = requirementRevHis[_projectId][_requirementId];
        revHis.push(_requirementHash);
        revDateHis = requirementRevHisDate[_projectId][_requirementId];
        uint256 time = block.timestamp;
        revDateHis.push(time);
        revAddrHis = requirementRevHisAddr[_projectId][_requirementId];
        revAddrHis.push(_reviewer);
        project.lastUpdate = time;
        hashToRequirements[_requirementHash][0] = _projectId;
        hashToRequirements[_requirementHash][1] = _requirementId;
        projects[_projectId - 1] = project;
        projectRequirementState[_projectId][_requirementId] = DataStructure
            .RequirementState
            .REVIEWED;
    }

    ///@dev set requirement as approved
    function setApprovedRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash,
        address _approver
    ) public whenNotPaused hasMasterRole {
        string[] storage appHis;
        uint256[] storage appDateHis;
        address[] storage appAddrHis;
        DataStructure.Project memory project = getProject(_projectId - 1);
        require(
            project.state != DataStructure.ProjectState.CLOSED,
            "El proyecto ya ha sido cerrado"
        );
        projectRequirementHash[_projectId][_requirementId][
            2
        ] = _requirementHash;
        appHis = requirementAppHis[_projectId][_requirementId];
        appHis.push(_requirementHash);
        appDateHis = requirementAppHisDate[_projectId][_requirementId];
        uint256 time = block.timestamp;
        appDateHis.push(time);
        appAddrHis = requirementAppHisAddr[_projectId][_requirementId];
        appAddrHis.push(_approver);
        project.lastUpdate = time;
        hashToRequirements[_requirementHash][0] = _projectId;
        hashToRequirements[_requirementHash][1] = _requirementId;
        projects[_projectId - 1] = project;
        projectRequirementState[_projectId][_requirementId] = DataStructure
            .RequirementState
            .APPROVED;
    }

    ///@dev update any parameter of project struct
    function updateProject(
        uint256 _projectId,
        DataStructure.Project memory project
    ) public whenNotPaused hasMasterRole {
        projects[_projectId - 1] = project;
    }

    ///@dev set register request
    function setRegisterReq(
        DataStructure.RegisterRequest memory _registerReq
    ) public whenNotPaused {
        _registerReq.IdReq = getRegisterRequestIndex();
        registerRequests.push(_registerReq);
    }

    ///@dev approve register request
    function attendRegisterReq(
        uint256 _idRequest,
        uint256 _val
    ) public hasMasterRole whenNotPaused {
        requestAttend[_idRequest] = _val;
        if (_val == 1) {
            aRegisterRequest += 1;
        } else if (_val == 2) {
            dRegisterRequest += 1;
        }
        removeRegisterReqItem(_idRequest);
    }

    ///@dev remove register request accepted or declined
    function removeRegisterReqItem(uint256 _idRequest) internal {
        require(_idRequest < registerRequests.length, "index out of bound");
        for (uint256 i = _idRequest; i < registerRequests.length - 1; i++) {
            registerRequests[i] = registerRequests[i + 1];
        }
        registerRequests.pop();
    }

    function getProject(
        uint256 _projectId
    ) public view whenNotPaused returns (DataStructure.Project memory project) {
        project = projects[_projectId];
    }

    function getProjectName(
        uint256 _projectId
    ) public view whenNotPaused returns (string memory projectName) {
        projectName = projects[_projectId].name;
    }

    ///@dev getter functions
    function getProjectRequirementName(
        uint256 _projectId,
        uint256 _requirementId
    ) public view whenNotPaused returns (string memory requirement) {
        requirement = projectRequirementName[_projectId][_requirementId];
    }

    function getProjectAdminAddr(
        uint256 _projectId
    ) public view whenNotPaused returns (address adminAddr) {
        adminAddr = projects[_projectId].adminAddr;
    }

    function getProjectTotalReq(
        uint256 _projectId
    ) public view whenNotPaused returns (uint256 requirements) {
        requirements = projects[_projectId].requirements;
    }

    function getProjectsByUser(
        address _user
    ) public view whenNotPaused returns (uint256[] memory) {
        uint256[] memory projectIds;
        projectIds = projectsByUser[_user];
        return (projectIds);
    }

    function getProjectState(
        uint256 _projectId
    )
        public
        view
        whenNotPaused
        returns (DataStructure.ProjectState projectState)
    {
        projectState = projects[_projectId].state;
    }

    function getRegisterReq(
        uint256 _requestId
    )
        public
        view
        whenNotPaused
        returns (DataStructure.RegisterRequest memory registerRequest)
    {
        registerRequest = registerRequests[_requestId];
    }

    function getRegisterRequestIndex()
        public
        view
        whenNotPaused
        returns (uint256)
    {
        return (registerRequests.length);
    }
}
