'use client'
import styles from './page.module.css'
import { useParams } from "next/navigation"
import Topbar from '@/app/_components/Topbar/Topbar'
import SvgIcon from '@/components/SvgIcon'
import {useRouter} from 'next/navigation'
import { deleteQuestionnaireAnswer, getAllFinllIn, getFinllInById } from '@/services/statistics/statistics'
import { useEffect, useState } from 'react'
import {GetAllFinllInResponse,Question } from '@/services/statistics/type'
import { formatDate } from '@/lib/utlisFuntion'
import {filesItemType} from '@/services/file/type'
import { reqFileList } from '@/services/file/file'
import { message, Pagination } from 'antd'
import MyTable from '../_conponents/MyTable.tsx/MyTable'
import MyStatisticModal from '../_conponents/MyStatisticModal/MyStatisticModal'
import type { SurveyData, SurveyDataItem } from '@/services/statistics/type'
import type { TableRowData } from '../_conponents/MyTable.tsx/type'
import { useAuthStore } from '@/stores/authStore'
import modal from 'antd/es/modal'
export default function Page() {
  const { id } = useParams()
  const [total, setTotal] = useState<number>(0);
  const [reData, setReData] = useState<SurveyDataItem[]>([]);
  const [title, setTitle] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [createTime, setCreateTime] = useState<string>();
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<string[]>([]); // 文件ID数组
  const [fileList, setFileList] = useState<filesItemType[]>([]); // 所有文件列表（用于匹配文件信息）
  const [currentRecord, setCurrentRecord] = useState<TableRowData | null>(null);
  // 处理返回按钮点击
  const router = useRouter()
  const userRole = useAuthStore((state) => state.userRole);
  // console.log('userRole',userRole)
  // console.log('userRole',userRole)
  const handleBack = () => {
      router.push('/')
  };
   // 根据文件ID获取文件信息
    const getFileInfoById = (fileId: string): filesItemType | null => {
        return fileList.find(file => file.id === fileId) || null;
    };
  const getData= async (id:string, page:number = 1, size:number = 10)=>{
        const params={
            page:page,
            size:size,
            id:id
        }
        // console.log('params',params)
        try {
            const res= await  getAllFinllIn(params)
          const res2 = await getFinllInById(params.id)
          // console.log(res)
          // console.log(res2)
          setTotal(res.totalData)
          // console.log('res.data',res.data)
          setReData(res.data||[])
          // setReData(res.data)
          setTitle(res2.title)
          setInfo(res2.info)
          setCreateTime(formatDate(res2.createTime))
            setQuestions(res2.questions || [])
            // // // 获取文件ID数组
            if (res2.files && Array.isArray(res2.files)) {
                setFiles(res2.files);
            } else {
                setFiles([]);
            }
            message.success('获取数据成功')
        }catch(err){
            console.error(err);
            // message.error('获取数据失败')
        }
  }
   // 预览文件
    const handlePreviewFile = async (fileId: string) => {
      const fileInfo = getFileInfoById(fileId);
      const fileUUID=fileInfo?.fileUUIDName
        window.open(`/api/file/${fileUUID}`, '_blank')
  };
   // 处理编辑按钮点击
    const handleEdit = (record: TableRowData) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };
  // 分页
    const handlePageChange = (page: number, size: number) => {
        setCurrent(page);
        setPageSize(size);
        getData(id as string, page, size);
    };
   useEffect(() => {
        const fetchAllFiles = async () => {
            if (files.length === 0) return;
            try {
                // 获取所有文件（可能需要分页获取，这里先获取前100个）
              const res = await reqFileList(1, 20);
              // console.log(res)
                setFileList(res.data || []);
            } catch (error) {
                console.error('获取文件列表失败:', error);
            }
        };

        fetchAllFiles();
    }, [files]);
    
  useEffect(() => {
    getData(id as string, current, pageSize);
     
  }, [])
   // 处理删除按钮点击
    const handleDelete = (record: TableRowData) => {
        console.log('record',record);
        modal.confirm({
            title: '确认删除',
            content: `确定要删除第 ${record.index} 条答卷数据吗？删除后将无法恢复。`,
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            centered: true,
            onOk: async () => {
                try {
                    if (!record.id) {
                        message.error('无法获取答卷ID');
                        return;
                    }
                    await deleteQuestionnaireAnswer(record.id);
                    message.success('删除成功');
                    // 重新获取数据
                    getData(id as string, current, pageSize);
                } catch (error) {
                    console.error('删除失败:', error);
                    message.error('删除失败，请重试');
                }
            },
        });
    };
  //  console.log(total)
  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.statisticTop}>
        <Topbar></Topbar>
      </div>
      <div className={styles.statisticCenter}>
         <div className={styles.centerLeft} onClick={handleBack} style={{cursor: 'pointer'}}>
            <SvgIcon name="fanhui" width={"24"} height={"24"}></SvgIcon>
             <div className={styles.text}>返回</div>
        </div>
        <div className={styles.centerMiddle}>
          {/* <div>{ total}</div> */}
            <div className={styles.desc}>【{title}】-- {createTime}</div>
        </div>
        <div className={styles.centerRight}>
             {files && files.length > 0 && fileList.length > 0 ? (
                        files.map((fileId) => {
                          const fileInfo = getFileInfoById(fileId);
                            // console.log('fileInfo',fileInfo)
                            if (!fileInfo) return null;
                            return (
                                <div 
                                    key={fileId}
                                    className={styles.origin}
                                    onClick={() => handlePreviewFile(fileId)}
                                    style={{ cursor: 'pointer' }}
                                    title="点击预览文件"
                                >
                                    {fileInfo?.fileTureName}
                                </div>
                            );
                        })
                    ) : (
                        <div  aria-hidden="true">
                        </div>
                    )}
        </div>
        
      </div>
       <div className={styles.centerBottom}>
                <div className={styles.main}>
                    <div className={styles.numberTotal}>
                        问卷统计（共{total}条数据）
                    </div>
          <div className={styles.table}>
                        <MyTable
                            tableData={reData}
                            questions={questions}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            userRole={userRole}
                        />
                    </div>
                    <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showTotal={(total) => `共 ${total} 条`}
                        align={'center'}
                    />
                </div>
                <div className="topic">
                </div>
            </div>
            <MyStatisticModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    setIsModalOpen(false);
                    getData(id as string, current, pageSize);
                }}
                record={currentRecord}
                questions={questions}
                surveyId={id as string}
                title={title}
            />
    </div>
  )
}