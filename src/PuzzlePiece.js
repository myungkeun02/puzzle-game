import React from "react";

const PuzzlePiece = ({ piece, onClick }) => {
  const { image, position } = piece;
  const pixelData = Array.from(image);
  const width = Math.sqrt(pixelData.length / 4);

  const style = {
    width: "100%",
    height: "100%",
    background: `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${
      pixelData[3] / 255
    })`,
    gridColumn: `${position.x + 1}`,
    gridRow: `${position.y + 1}`,
    cursor: "pointer",
  };

  return <div style={style} onClick={() => onClick(piece.id)} />;
};

export default PuzzlePiece;
