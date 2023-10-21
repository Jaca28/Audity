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

    function getProject(
        uint256 _projectId
    ) public view whenNotPaused returns (DataStructure.Project memory project) {
        project = projects[_projectId];
    }
}
