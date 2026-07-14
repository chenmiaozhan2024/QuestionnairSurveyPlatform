'use client'
import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import { Pagination } from 'antd'
import style from './MyTablePlus.module.css'
import { MyTablePlusProps } from './type'

const MyTablePlus = ({ title, createTime, questions, total, answers, current, pageSize, onPageChange }: MyTablePlusProps) => {
  const leftQuestions = questions?.filter((q) =>
    ['text', 'single', 'textarea'].includes(q.type),
  ) || []

  const rightQuestions = questions?.filter((q) =>
    !['text', 'single', 'textarea'].includes(q.type),
  ) || []

  return (
    <div className={style.tablePlusContainer}>
      <div className={style.tablePlusleft}>
        <div className={style.total}>问卷统计（共{total}条数据）</div>
        <div className={style.header}>
          <table className={style.table}>
            <thead>
              <tr>
                {[
                  ...leftQuestions.map((q) => (
                    <th key={q.id}>{q.title}</th>
                  )),
                  <th key="feedback">题目反馈</th>,
                  <th key="time">填写时间</th>,
                  <th key="action">操作</th>,
                ]}
              </tr>
            </thead>
            <tbody>
              {answers?.map((item) => (
                <tr key={item.id}>
                  {[
                    ...leftQuestions.map((q) => {
                      const answer = item.answers.find((a) => a._id === q.id)
                      const value = answer?.text || answer?.options?.[0]?.text || ''
                      return <td key={q.id}>{value || '-'}</td>
                    }),
                    <td key={`${item.id}-feedback`}>11</td>,
                    <td key={`${item.id}-time`}>{item.collectTime ? item.collectTime.replace('T', ' ').replace('Z', '') : '-'}</td>,
                    <td key={`${item.id}-action`}>编辑 删除</td>,
                  ]}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={style.pagination}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              showTotal={(t) => `共 ${t} 条`}
              onChange={(page, size) => onPageChange?.(page, size)}
            />
          </div>
        </div>
      </div>
      <div className={style.tablePlusRight}>
        <div className={style.tablePlusRightTop}>
          <div className={style.title}>{title || '标题'}--{createTime}</div>
          <div className={style.files}>
            <SvgIcon name="wenjian" width="30" height="30" />
          </div>
        </div>
        <div className={style.tablePlusRightBottom}>
          <div className={style.question}>题目选择</div>
          <ul className={style.questions}>
            {rightQuestions.map((q) => (
              <li className={style.questionsList} key={q.id}>{q.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
export default MyTablePlus
