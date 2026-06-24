import SvgIcon from '@/components/SvgIcon';
import EditBox from './_components/EditBox';
import styles from './QuestionTypePanel.module.css'

export default function QuestionTypePanel() {
  return (
    <div className={styles.questionTypePanel}>
      <div className={styles.left}>
                        <div className={styles.EditTop}>
                            <div className={styles.title}>添加题型</div>
                            <EditBox  name="编辑" iconName="more" ></EditBox>
                            {/*<div className="editBox">*/}
                            {/*    <div className="edit">编辑</div>*/}
                            {/*    <SvgIcon name="more" width={"24"} height={"24"}></SvgIcon>*/}
                            {/*</div>*/}
                            <div className={styles.upAddAndDown}>
                                <div className={styles.upAddAndDownLeft}>
                                    <div className={styles.text}>1</div>
                                </div>
                                <div className={styles.upAddAndDownRight}>
                                    <ul>
                                        <li>
                                            <div className={styles.line}></div>
                                            <div>往上方添加新的题目</div>
                                        </li>
                                        <li>
                                            <div className={styles.line}></div>
                                            <div>往下方添加新的题目</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.EditMiddle}>
                            <EditBox  name="题型" iconName="more" ></EditBox>
                            <div className={styles.EditMiddleBox}>
                                <div className={styles.EditMiddleBoxLeft}>
                                    <div className={styles.text}>1</div>
                                </div>
                                <div className={styles.EditMiddleBoxRight}>
                                    <ul>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="daunluoshuoming" size="24px"  className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>
                                                <div className={styles.desc}>段落说明</div>
                                                <div className={styles.rightIcon}>
                                                    <div className={styles.line}></div>
                                                    <SvgIcon name="add" width={"24"} height={"24"}   onClick={() => {
                                                        const newQuestion = {
                                                            type: "QUESTION_TYPE_DESCRIPTION",
                                                            title: "",
                                                            id: String(Date.now()), // 或者用 (questions.length + 1).toString()
                                                            // info: "请输入段落说明内容...",
                                                        };
                                                    }}></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="danxuanti" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                      <div className={styles.LiRight}>
                                        <div className={styles.line}></div>
                                                <div className={styles.desc}>单选题</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}
                                                             onClick={() => {
                                                                 const newSingleQuestion = {
                                                                     type: "QUESTION_TYPE_SINGLE",         // ✅ 题目类型：单选题
                                                                     title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                                     info: "",                // ✅ 题目描述/提示语（可选）
                                                                     required: true,                      // ✅ 是否必填，可设为 true/false
                                                                     options: [""],
                                                                     id: String(Date.now()),               // ✅ 唯一 ID，可用时间戳
                                                                
                                                                 };
                                                             }}>
                                                    </SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="duoxuanti" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>
                                                <div className={styles.desc}>多选题</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}
                                                             onClick={() => {
                                                        const newSingleQuestion = {
                                                            type: "QUESTION_TYPE_MULTI",         // ✅ 题目类型：多选
                                                            title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                            info: "",                // ✅ 题目描述/提示语（可选）
                                                            required: true,                      // ✅ 是否必填，可设为 true/false
                                                            options: [""],
                                                            id: String(Date.now()),               // ✅ 唯一 ID，可用时间戳
                                                          
                                                        };
                                                    }}
                                                    ></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="xialaxuanxiang" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>
                                                <div className={styles.desc}>下拉选项</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}   onClick={() => {
                                                        const newSingleQuestion = {
                                                            type: "QUESTION_TYPE_SELECT",         // ✅ 题目类型：下拉
                                                            title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                            info: "",                // ✅ 题目描述/提示语（可选）
                                                            required: true,                      // ✅ 是否必填，可设为 true/false
                                                            options: [""],
                                                            id: String(Date.now()),               // ✅ 唯一 ID，可用时间戳
                                                  
                                                        };
                                                      
                                                    }}></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="danhangwenben" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>
                                                <div className={styles.desc}>单行文本</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}
                                                             onClick={() => {
                                                        const newSingleQuestion = {
                                                            type: "QUESTION_TYPE_TEXT",         // ✅ 题目类型：单行文本
                                                            title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                            info: "",                // ✅ 题目描述/提示语（可选）
                                                            required: true,                      // ✅ 是否必填，可设为 true/false
                                                            id: String(Date.now()),               // ✅ 唯一 ID，可用时间戳
                                                        
                                                        };
                                                      
                                                    }}
                                                    ></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="duohangwenben" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>
                                                <div className={styles.desc}>多行文本</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}
                                                             onClick={() => {
                                                                 const newSingleQuestion = {
                                                                     type: "QUESTION_TYPE_TEXTAREA",         // ✅ 题目类型：单行文本
                                                                     title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                                     info: "",                // ✅ 题目描述/提示语（可选）
                                                                     required: true,                      // ✅ 是否必填，可设为 true/false
                                                                     id: String(Date.now()),               // ✅ 唯一 ID，可用时间戳
                                                                  
                                                                 };
                                                      
                                                             }}
                                                    ></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.LiLeft}>
                                                <div className={styles.line}></div>
                                                <div className={styles.icon}> 
                                                    <SvgIcon name="juzhen" width={"24"} height={"24"} className={"daunluoshuomingIcon"}></SvgIcon>
                                                </div>
                                            </div>
                                            <div className={styles.LiRight}>

                                                <div className={styles.desc}>矩形单选题</div>
                                                <div className={styles.rightIcon}>
                                                    <SvgIcon name="add" width={"24"} height={"24"}
                                                             onClick={() => {
                                                                 const newSingleQuestion = {
                                                                     type: "QUESTION_TYPE_MATRIX_RADIO",         // ✅ 题目类型：矩阵单选
                                                                     title: "",                      // ✅ 题目标题，可自定义，比如 "你的性别"
                                                                     info: "",                // ✅ 题目描述/提示语（可选）
                                                                     required: true,                      // ✅ 是否必填，可设为 true/false
                                                                     options: ['', ''],       // ✅ 默认两个空选项（列）
                                                                     subTitles: ['', ''],    // ✅ 默认两个空题目（行）
                                                                     id: String(Date.now()),
                                                                   
                                                                 };
                    
                                                             }}></SvgIcon>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.EditBottom}>
                                <EditBox  name="文档链接" iconName="more" ></EditBox>
                                <div className={styles.upAddAndDown}>
                                    <div className={styles.upAddAndDownRight} >
                                        <div 
                                            className={styles.documentLink} 
                                           
                                            style={{ cursor: 'default' }}
                                        >
                                            添加文档链接
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
    </div>
  )
}