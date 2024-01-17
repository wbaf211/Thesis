import { Route, Routes } from 'react-router';
import * as XLSX from 'xlsx';
import './App.css';
import Overview from './Page/Overview/Overview';
import Setting from './Page/Setting/Setting'
import Compare from './Page/Compare/Compare';
import VerticalHeader from './VerticalHeader/VerticalHeader';
import data from '../src/data/data.json'
import realData from "./data/realData.json"
import { useEffect, useState } from 'react';

function App() {

  const totalYearList = [];
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const processExcelFile = async () => {
      // Specify the correct relative path to your Excel file in the "data" folder
      const excelFilePath = 'D:\NgoThanhThe\Thesis\thesis\src\data\data.xlsx';
      console.log(excelFilePath);

      try {
        const response = await fetch(excelFilePath);
        const data = await response.arrayBuffer();

        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to convert
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Update state with the JSON data
        setJsonData(jsonData);

        // Process the jsonData as needed
        console.log(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    processExcelFile();
  }, []);

  useEffect(() => {
    for (let obj of data) {
      let i = 0;
      for (let course in obj.grade) {
        i++;
        obj.Total += obj.grade[`${course}`];
      }
      obj.Avg = (obj.Total / i).toFixed(2);
    }
  },[])

  function addYearKey(data) {
    const newData = data.map(item => {
        const idDigits = item.id.match(/\d+/);
        const idFirstTwoDigits = idDigits ? idDigits[0].substring(0, 2) : '';

        const year = idFirstTwoDigits.length > 0 ? "K" + idFirstTwoDigits : "Invalid";

        return { ...item, year };
    });

    return newData;
}


  const newData = addYearKey(realData);

  newData.forEach(i => {
      if (!totalYearList.includes(i.year)) {
        totalYearList.push(i.year);
      }
  });

  function calculateTotalStudents(data) {
    const yearTotals = {};
  
    // Duyệt qua mỗi mục trong dữ liệu
    for (const item of data) {
        const year = item.year;
        const id = item.id;
  
        // Kiểm tra sự trùng lặp của "id" trong mảng
        if (!yearTotals[year]) {
            yearTotals[year] = {
                total: 0,
                uniqueIds: [],
            };
        }
  
        if (!yearTotals[year].uniqueIds.includes(id)) {
            // Nếu "id" chưa được thêm vào mảng, tăng tổng sinh viên và thêm "id" vào mảng
            yearTotals[year].total += 1; // Tăng giá trị total lên 1
            yearTotals[year].uniqueIds.push(id);
        }
    }
  
    return yearTotals;
  }

  const totalStudentByYearList = calculateTotalStudents(newData);
  const sortedKey = Object.keys(totalStudentByYearList).sort();

  function transformStudentData(data) {
    const result = {};

    data.forEach(student => {
        const studentId = student.id;

        if (!result[studentId]) {
            result[studentId] = { courses: {}, Avg: 0, classify: "", year: "" };
        }

        const courseKey = student.course;
        const score = parseInt(student.score);

        result[studentId].courses[courseKey] = score;
        result[studentId].year = student.year; // Thêm giá trị "year"
    });

    // Calculate average and classify for each student
    Object.keys(result).forEach(studentId => {
        const courses = result[studentId].courses;
        const scores = Object.values(courses);
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const avg = scores.length > 0 ? sum / scores.length : 0;

        result[studentId].Avg = avg;

        // Classify based on average score
        if (avg >= 80) {
            result[studentId].classify = "Excellent";
        } else if (avg >= 70) {
            result[studentId].classify = "Good";
        } else if (avg >= 60) {
            result[studentId].classify = "Average Good";
        } else if (avg >= 50) {
            result[studentId].classify = "Average";
        } else {
            result[studentId].classify = "Bad";
        }
    });

    // Convert to array format
    const finalResult = Object.keys(result).map(studentId => {
        const { courses, Avg, classify, year } = result[studentId];
        return { [studentId]: { courses, Avg, classify, year } };
    });

    return finalResult;
}

  const testData = transformStudentData(newData);
  
  const tableData = (data) => {
    let keyCounter = 1; // Biến đếm cho giá trị tự tăng

    const newData = data.map((item, index) => {
    const id = Object.keys(item)[0];
    const school = id.substring(0, 2);
    const avg = parseFloat(item[id].Avg.toFixed(2));

    // Thêm key "key" với giá trị tự tăng
    const key = keyCounter++;

    return { id, school, ...item[id], Avg: avg, key };
  });

  return newData;
  }

  const tabData = tableData(testData);

  function countStudentsByClassifyAndYear(transformedData) {
    const result = [];

    transformedData.forEach(student => {
        const studentId = Object.keys(student)[0];
        const { classify, year } = student[studentId];

        if (!result[year]) {
            result[year] = {
                "Excellent": 0,
                "Good": 0,
                "Average Good": 0,
                "Average": 0,
                "Bad": 0
            };
        }

        result[year][classify]++;
    });

    // Lấy mảng các key "year" và sắp xếp từ bé đến lớn
    const sortedYears = Object.keys(result).sort((a, b) => a.localeCompare(b));

    // Tạo mảng kết quả đã sắp xếp
    const finalResult = sortedYears.map(year => ({ [year]: result[year] }));

    return finalResult;
}

  const overviewStudent = countStudentsByClassifyAndYear(testData);

  function mergeData(data, data1) {
    // Tạo một đối tượng mới để lưu kết quả
    const mergedData = {};
  
    // Lặp qua totalStudentByYearList
    Object.keys(data).forEach(key => {
      // Kiểm tra xem khóa có tồn tại trong data1 không
      const matchingData = data1.find(item => item[key]);
  
      // Nếu có, kết hợp thông tin từ cả hai đối tượng
      if (matchingData) {
        mergedData[key] = {
          ...data[key],
          ...matchingData[key],
        };
      } else {
        // Nếu không, giữ nguyên thông tin từ totalStudentByYearList
        mergedData[key] = { ...data[key] };
      }
    });
  
    return mergedData;
  }

  const overviewData = mergeData(totalStudentByYearList, overviewStudent);

  // hàm để lấy các course từ data

  const extractCourses = (data) => {
    if (!data || data.length === 0) {
    console.error('Invalid or empty JSON data.');
    return [];
  }

  // Mảng để lưu trữ các course duy nhất dưới dạng object
  let coursesList = [];

  // Duyệt qua mỗi phần tử trong mảng JSON data
  data.forEach(item => {
    // Kiểm tra xem item và item.course có tồn tại không
    if (item && item.course) {
      // Tìm index của "IU" trong chuỗi course
      const indexOfIU = item.course.indexOf("IU");

      // Kiểm tra xem có "IU" trong chuỗi course hay không
      if (indexOfIU !== -1) {
        // Tạo object với key "id" và "name"
        const courseObject = {
          id: item.course.substring(0, indexOfIU + 2),
          name: item.course.substring(indexOfIU + 3)
        };

        // Kiểm tra xem course đã tồn tại trong mảng chưa
        if (!coursesList.some(course => course.id === courseObject.id)) {
          // Nếu chưa tồn tại, thêm course vào mảng
          coursesList.push(courseObject);
        }
      }
    }
  });

  return coursesList;
  }

  const uniqueCourses = extractCourses(realData);

  const countStudentsByClassify = (data) => {
    const classifyCount = {};

  // Duyệt qua mỗi phần tử trong mảng
  data.forEach(item => {
    // Kiểm tra xem phần tử có tồn tại không
    if (item) {
      // Duyệt qua các key trong object con của mỗi phần tử
      Object.values(item).forEach(subItem => {
        // Kiểm tra xem object con có key 'classify' không
        if (subItem && subItem.classify) {
          const classify = subItem.classify;

          // Kiểm tra xem classify đã có trong classifyCount chưa
          if (classifyCount[classify] === undefined) {
            // Nếu chưa có, khởi tạo với giá trị 1
            classifyCount[classify] = 1;
          } else {
            // Nếu đã có, tăng giá trị lên 1
            classifyCount[classify]++;
          }
        }
      });
    }
  });

  return classifyCount;
  }

  const studentListByClassify = countStudentsByClassify(testData)

  console.log("newData: ", newData);
  console.log("result: ", totalStudentByYearList);
  console.log("testData: ", testData);
  console.log("overviewStudent: ", overviewStudent);
  console.log("overviewData: ", overviewData);
  console.log("uniqueCourses: ", uniqueCourses);
  console.log("studentListByClassify: ", studentListByClassify);

  return (
    <div className="App">
      <VerticalHeader/>
      <div className='App-content'>
        <Routes>
          <Route exact path='/' element={<Overview totalStudentByYearList={totalStudentByYearList} overviewStudent={overviewStudent} overviewData={overviewData} sortedKey={sortedKey} testData={testData} studentListByClassify={studentListByClassify} uniqueCourses={uniqueCourses}/>} />
          <Route path='/compare' element={<Compare uniqueCourses={uniqueCourses} sortedKey={sortedKey} data={tabData} classify={Object.keys(studentListByClassify)}/>} />
          <Route path='/setting' element={<Setting/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
