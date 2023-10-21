// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

library DataStructure {
    enum ProjectState {
        CREATED,
        INPROCESS,
        CLOSED
    }

    enum RequirementState {
        CREATED,
        MADE,
        REVIEWED,
        APPROVED
    }

    //Project Struct
    struct Project {
        string name;
        uint256 idProject;
        ProjectState state;
        address adminAddr;
        uint256 requirements;
        uint256 lastUpdate;
    }
}
