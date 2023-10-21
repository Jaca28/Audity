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
}
