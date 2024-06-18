import React, {useEffect, useState} from 'react';
import '../styles/Seat.css';

const Seat = ({ seatMap }) => {
    const [sections, setSections] = useState(seatMap.length);
    const newColumns = seatMap.map(seat => seat.columns);
    const [columns, setColumns] = useState(newColumns);
    const [totalRow, setTotalRow] = useState( seatMap[0].numRows );
    const [totalColumn, setTotalColumn] = useState(() => {
        if (seatMap.length > 0) {
            return seatMap.reduce((total, seat) => total + seat.columns, 0);
        } else {
            return 0;
        }
    });

    useEffect(() => {
        var dynamicColumn = 0;
        const marginValue = '18px';
        for(var i=0;i<sections-1;i++){
            dynamicColumn += columns[i];
            document.querySelectorAll('.seat:nth-of-type(' + dynamicColumn + ')').forEach(element => {
                element.style.marginRight = marginValue;
            });
        }


    }, []);
    const generateRowLetters = (startLetter, totalColumns) => {
        const startCode = startLetter.charCodeAt(0);
        const letters = [];

        for (let i = 0; i < totalRow; i++) {
            const currentCode = startCode + i;
            letters.push(String.fromCharCode(currentCode));
        }

        return letters;
    };

    const generateRowLettersReverse = (startLetter, totalColumns) => {
        const startCode = startLetter.charCodeAt(0);
        const letters = [];

        for (let i = 0; i < totalRow; i++) {
            const currentCode = startCode - i;
            letters.push(String.fromCharCode(currentCode));
        }

        return letters;
    };


    const renderSeats = () => {
        const seats = [];
        // console.log("totalColumn",totalColumn)
        const rowLetters = seatMap[0].startRowNumber === 'A'
            ? generateRowLetters('A', totalColumn)
            : generateRowLettersReverse(seatMap[0].startRowNumber, totalColumn);
        for (let i = 0; i < totalRow; i++) {
            const rowSeats = [];
                for (let j = 0; j < totalColumn; j++) {
                    rowSeats.push(<div className="seat" key={`seat-${i}-${j}`} > {`${rowLetters[i]}${j + 1}`}</div>);
                }
            seats.push(
                <div className="row" key={`row-${i}`}>
                    {rowSeats}
                </div>
            );
        }
        return seats;
    };

    return (
        <div className="body">
            <ul className="showcase">
                <li>
                    <div className="seat"></div>
                    <small>Available</small>
                </li>
            </ul>
            <div className="container">
                <div className="screen"></div>
                {renderSeats()}
            </div>

        </div>
    );
};

export default Seat;
