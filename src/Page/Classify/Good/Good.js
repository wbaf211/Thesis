import React from "react";
import LineChart from "../../../Chart/LineChart";

function Good({overviewData, sortedKey}) {
    return (
        <div className="good">
            <LineChart totalStudentByYearList={overviewData} hKey={`Good`} sortedKeys={sortedKey} title={"The Good Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Good;