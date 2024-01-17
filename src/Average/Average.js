import React from "react";
import data from '../data/data.json'
import LineChart from "../Chart/LineChart";

function Average({overviewData, sortedKey}) {
    return (
        <div className="avg">
            <LineChart totalStudentByYearList={overviewData} hKey={`Average`} sortedKeys={sortedKey} title={"The Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Average;