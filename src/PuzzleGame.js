import React, { useState } from "react";
import axios from "axios";
import PuzzlePiece from "./PuzzlePiece";

const PuzzleGame = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [pieces, setPieces] = useState(4);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [solved, setSolved] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handlePiecesChange = (event) => {
    setPieces(parseInt(event.target.value, 10));
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { imagePath } = response.data;
      getPuzzlePieces(imagePath);
    } catch (error) {
      console.error(error);
    }
  };

  const getPuzzlePieces = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/puzzle/${filename}/${pieces}`
      );
      setPuzzlePieces(response.data.puzzlePieces);
      setSolved(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePieceClick = (pieceId) => {
    const clickedPiece = puzzlePieces.find((piece) => piece.id === pieceId);

    const emptyPiece = puzzlePieces.find(
      (piece) => piece.id === pieces * pieces - 1
    );
    const emptyPosition = emptyPiece.position;

    const xDiff = Math.abs(clickedPiece.position.x - emptyPosition.x);
    const yDiff = Math.abs(clickedPiece.position.y - emptyPosition.y);

    if ((xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1)) {
      const updatedPuzzlePieces = puzzlePieces.map((piece) => {
        if (piece.id === clickedPiece.id) {
          return { ...piece, position: emptyPosition };
        } else if (piece.id === emptyPiece.id) {
          return { ...piece, position: clickedPiece.position };
        } else {
          return piece;
        }
      });

      setPuzzlePieces(updatedPuzzlePieces);
      checkPuzzleSolved(updatedPuzzlePieces);
    }
  };

  const checkPuzzleSolved = (pieces) => {
    let solved = true;

    for (let i = 0; i < pieces.length; i++) {
      const { id, position } = pieces[i];

      if (id !== position.y * pieces.length + position.x) {
        solved = false;
        break;
      }
    }

    setSolved(solved);
  };

  return (
    <div>
      <h1>Puzzle Game</h1>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="number"
          min="2"
          max="8"
          value={pieces}
          onChange={handlePiecesChange}
        />
        <button onClick={handleImageUpload}>Upload</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${pieces}, 1fr)`,
          gap: "2px",
        }}
      >
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            onClick={handlePieceClick}
          />
        ))}
      </div>
      {solved && <p>Puzzle Solved!</p>}
    </div>
  );
};

export default PuzzleGame;
