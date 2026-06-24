// 新增的 EditBox 组件
import SvgIcon from '@/components/SvgIcon';
import styles from './Edit.box.module.css'
interface EditBoxProps {
    name: string;
    iconName: string;
}

const EditBox: React.FC<EditBoxProps> = ({ name, iconName }) => {
    return (
        <div className={styles.editBox}>
            <div className={styles.edit}>{name}</div>
            <SvgIcon name={iconName} width={"24"} height={"24"} />
        </div>
    );
};
export default EditBox;