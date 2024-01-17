import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import './VerticalHeader.css';
import logo from '../img/logo.png';
import SUBJECTS from '../data/Course.json';
import PRE from '../data/PreCourses.json';
import {
    QrcodeOutlined,
    SettingOutlined,
    LineChartOutlined
} from '@ant-design/icons';

function VerticalHeader() {
    const [select, isSelect] = useState(parseInt(sessionStorage.getItem('select')) || 1);
    
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("select", select)
    }, [select])
    return (
        <header className="vertical-header">
            <div>
                <img src={logo}></img>

                <div className="nav-section">
                    <ul>
                        <li className={`${select === 1 ? 'active' : ''}`} onClick={() => (isSelect(1), navigate('/'))}><QrcodeOutlined /><span className="word">Overview</span></li>
                        <li className={`${select === 2 ? 'active' : ''}`} onClick={() => (isSelect(2), navigate('compare'))}><LineChartOutlined /><span className="word">Compare</span></li>
                        <li className={`${select === 3 ? 'active' : ''}`} onClick={() => (isSelect(3), navigate('setting'))}><SettingOutlined /><span className="word">Setting</span></li>
                    </ul>
                </div>  
            </div>
        </header>
    );
}

export default VerticalHeader;