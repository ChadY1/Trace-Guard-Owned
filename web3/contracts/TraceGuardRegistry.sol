// SPDX-License-Identifier: MIT
// Contrat de registre immuable pour ancrer des empreintes de médias TraceGuard avec contrôle d'accès basique.
pragma solidity ^0.8.20;

contract TraceGuardRegistry {
    struct MediaAnchor {
        address submitter;
        bytes32 mediaHash;
        uint256 timestamp;
        string metadataUri;
    }

    address public owner;
    mapping(address => bool) public allowedSubmitters;
    mapping(bytes32 => MediaAnchor) public anchors;

    event MediaAnchored(bytes32 indexed mediaHash, address indexed submitter, string metadataUri);
    event SubmitterGranted(address indexed submitter);
    event SubmitterRevoked(address indexed submitter);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyAllowed() {
        require(allowedSubmitters[msg.sender], "unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        allowedSubmitters[msg.sender] = true;
    }

    function grantSubmitter(address submitter) external onlyOwner {
        allowedSubmitters[submitter] = true;
        emit SubmitterGranted(submitter);
    }

    function revokeSubmitter(address submitter) external onlyOwner {
        allowedSubmitters[submitter] = false;
        emit SubmitterRevoked(submitter);
    }

    function anchor(bytes32 mediaHash, string calldata metadataUri) external onlyAllowed {
        require(anchors[mediaHash].timestamp == 0, "already anchored");
        anchors[mediaHash] = MediaAnchor({
            submitter: msg.sender,
            mediaHash: mediaHash,
            timestamp: block.timestamp,
            metadataUri: metadataUri
        });
        emit MediaAnchored(mediaHash, msg.sender, metadataUri);
    }

    function get(bytes32 mediaHash) external view returns (MediaAnchor memory) {
        return anchors[mediaHash];
    }
}
