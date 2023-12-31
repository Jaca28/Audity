// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./DataStructure.sol";
import "./BlockData.sol";

contract BlockLogic is AccessControl, Pausable, Ownable {
    ///@dev Roles definition.
    bytes32 public constant adminRole = keccak256("adminRole");
    bytes32 public constant makerRole = keccak256("makerRole");
    bytes32 public constant reviewerRole = keccak256("reviewerRole");
    bytes32 public constant approverRole = keccak256("approverRole");

    ///@dev variables
    address public BlockDataAddr;
    BlockData blockData;

    ///@dev events
    event ProjectCreated(DataStructure.Project project);

    ///@dev constructor.
    constructor() Ownable() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    ///@dev modifiers
    modifier hasAdminRole() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(adminRole, msg.sender),
            "Caller is not authorized"
        );
        _;
    }
    modifier hasMakerRole() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(makerRole, msg.sender),
            "Caller is not authorized"
        );
        _;
    }
    modifier hasReviewerRole() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(reviewerRole, msg.sender),
            "Caller is not authorized"
        );
        _;
    }
    modifier hasApproverRole() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(approverRole, msg.sender),
            "Caller is not authorized"
        );
        _;
    }

    ///@dev set BlockData address
    function setBlockData(
        address _blockDataAddr
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        BlockDataAddr = _blockDataAddr;
    }

    ///@dev create project function
    function createProject(
        string memory _name,
        address _projectAdminAddr,
        uint _requirements
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        DataStructure.Project memory project = DataStructure.Project(
            _name,
            0, //the project id is given by the block data
            DataStructure.ProjectState.CREATED,
            _projectAdminAddr,
            _requirements,
            block.timestamp
        );
        blockData.setProject(project);
        emit ProjectCreated(project);
    }

    ///@dev set project requirement -  gives ID and set namet
    function setProjectRequirement(
        uint256 _projectId,
        string memory _nameRequirement
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setProjectRequirement(
            _projectId,
            _nameRequirement,
            msg.sender
        );
    }

    ///@dev add maker for an specific project requirement
    function setMaker(
        uint256 _projectId,
        uint256 _requirementId,
        address _makerAddr
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setMaker(_projectId, _requirementId, _makerAddr);
    }

    ///@dev add reviewer for an specific project requirement
    function setReviewer(
        uint256 _projectId,
        uint256 _requirementId,
        address _reviewerAddr
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setReviewer(_projectId, _requirementId, _reviewerAddr);
    }

    ///@dev add approver for an specific project requirement
    function setApprover(
        uint256 _projectId,
        uint256 _requirementId,
        address _approverAddr
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setApprover(_projectId, _requirementId, _approverAddr);
    }

    ///@dev set requirement as made
    function setMadeRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash
    ) public whenNotPaused hasAdminRole hasMakerRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setMadeRequirement(
            _projectId,
            _requirementId,
            _requirementHash,
            msg.sender
        );
    }

    ///@dev set requirement as reviewed
    function setReviewedRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash
    ) public whenNotPaused hasAdminRole hasReviewerRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setReviewedRequirement(
            _projectId,
            _requirementId,
            _requirementHash,
            msg.sender
        );
    }

    ///@dev set requirement as approved
    function setApprovedRequirement(
        uint256 _projectId,
        uint256 _requirementId,
        string memory _requirementHash
    ) public whenNotPaused hasAdminRole hasApproverRole {
        blockData = BlockData(BlockDataAddr);
        blockData.setApprovedRequirement(
            _projectId,
            _requirementId,
            _requirementHash,
            msg.sender
        );
    }

    ///@dev update project name in project struct
    function setProjectName(
        uint256 _projectId,
        string memory _name
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        DataStructure.Project memory project = blockData.getProject(
            _projectId - 1
        );
        project.name = _name;
        blockData.updateProject(_projectId, project);
    }

    ///@dev update project state in project struct
    function setProjectState(
        uint256 _projectId,
        DataStructure.ProjectState _state
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        DataStructure.Project memory project = blockData.getProject(
            _projectId - 1
        );
        project.state = _state;
        blockData.updateProject(_projectId, project);
    }

    ///@dev update project public admin address in project struct
    function setProjectAdminAddr(
        uint256 _projectId,
        address _adminAddr
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        DataStructure.Project memory project = blockData.getProject(
            _projectId - 1
        );
        project.adminAddr = _adminAddr;
        blockData.updateProject(_projectId, project);
    }

    ///@dev update project requirements in project struct
    function setProjectTotalReq(
        uint256 _projectId,
        uint _requirements
    ) public whenNotPaused hasAdminRole {
        blockData = BlockData(BlockDataAddr);
        DataStructure.Project memory project = blockData.getProject(
            _projectId - 1
        );
        project.requirements = _requirements;
        blockData.updateProject(_projectId, project);
    }

    ///@dev create register request function
    function createRegisterRequest(
        address _userAddr,
        string memory _role
    ) public whenNotPaused {
        blockData = BlockData(BlockDataAddr);
        DataStructure.RegisterRequest memory registerReq = DataStructure
            .RegisterRequest(0, _userAddr, _role, 0);
        blockData.setRegisterReq(registerReq);
    }

    function setRegisterRequest(
        uint256 _requestId,
        uint256 _val
    ) public hasAdminRole whenNotPaused {
        blockData = BlockData(BlockDataAddr);
        blockData.attendRegisterReq(_requestId, _val);
    }

    function setCloseProject(
        uint256 _projectId
    ) public hasAdminRole whenNotPaused {
        blockData = BlockData(BlockDataAddr);
        blockData.closeProject(_projectId);
    }
}
