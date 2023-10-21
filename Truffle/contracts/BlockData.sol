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

    ///@dev mappings
    mapping(uint => mapping(uint => string)) public projectRequirementName;
    mapping(uint => uint) public projectRequirementCount; // Count of setted requirements
    mapping(uint => mapping(uint => DataStructure.RequirementState))
        public projectRequirementState;
    mapping(uint => mapping(uint => address[])) public projectRequirementMakers; //Requirement MAKERS list
    mapping(uint => mapping(uint => address[])) public projectRequirementRevs; //Requirement REVIEWERS list
    mapping(uint => mapping(uint => address[])) public projectRequirementApps; //Requirement APPROVERS list

    mapping(address => uint[]) public projectsByUser; //user address to project ID

    ///@dev structs
    DataStructure.Project[] public projects;

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

    ///@dev update any parameter of project struct
    function updateProject(
        uint256 _projectId,
        DataStructure.Project memory project
    ) public whenNotPaused hasMasterRole {
        projects[_projectId - 1] = project;
    }

    function getProject(
        uint256 _projectId
    ) public view whenNotPaused returns (DataStructure.Project memory project) {
        project = projects[_projectId];
    }
}
