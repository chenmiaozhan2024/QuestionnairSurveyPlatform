import React from 'react';
import { Switch } from 'antd';
import styles from './Switch.module.css';

const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch defaultChecked onChange={onChange}  className={styles.switch} />;

export default App;