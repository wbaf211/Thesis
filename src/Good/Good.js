import React from "react";
import data from '../data/data.json'
import LineChart from "../Chart/LineChart";

function Good({overviewData, sortedKey}) {
    return (
        <div className="good">
            <LineChart totalStudentByYearList={overviewData} hKey={`Good`} sortedKeys={sortedKey} title={"The Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Good;