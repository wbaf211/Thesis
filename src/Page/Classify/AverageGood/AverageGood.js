import React from "react";
import LineChart from "../../../Chart/LineChart";

function AverageGood({overviewData, sortedKey}) {
    return (
        <div className="good">
            <LineChart totalStudentByYearList={overviewData} hKey={`Average Good`} sortedKeys={sortedKey} title={"The Average Good Student Distribution Chart by Year"}/>
        </div>
    );
}

export default AverageGood;