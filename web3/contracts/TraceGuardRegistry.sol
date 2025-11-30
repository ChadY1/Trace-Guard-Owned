// SPDX-License-Identifier: MIT
// Contrat de registre immuable pour ancrer des empreintes de médias TraceGuard.
pragma solidity ^0.8.20;

contract TraceGuardRegistry {
    struct MediaAnchor {
        address submitter;
        bytes32 mediaHash;
        uint256 timestamp;
        string metadataUri;
    }

    event MediaAnchored(bytes32 indexed mediaHash, address indexed submitter, string metadataUri);

    mapping(bytes32 => MediaAnchor) public anchors;

    function anchor(bytes32 mediaHash, string calldata metadataUri) external {
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
