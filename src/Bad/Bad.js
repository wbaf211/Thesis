import React from "react";
import data from '../data/data.json'
import LineChart from "../Chart/LineChart";

function Bad({overviewData, sortedKey}) {
    return (
        <div className="bad">
            <LineChart totalStudentByYearList={overviewData} hKey={`Bad`} sortedKeys={sortedKey} title={"The Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Bad;