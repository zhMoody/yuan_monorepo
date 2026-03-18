import {h} from 'vue'
import {NTag, NButton, NPopconfirm} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui'
import dayjs from "dayjs";


export const createColumns = (
  {editArticle}: { editArticle: (rowData: RowData.Data) => void },
  {deleteArticle}: { deleteArticle: (rowData: RowData.Data) => void }
): DataTableColumns<RowData.Data> => {
  return [
    {
      title: '作者',
      key: 'author'
    },
    {
      title: '标题',
      key: 'title'
    },
    {
      title: '关键字',
      key: 'keyword'
    },
    {
      title: '分类',
      key: 'name',
      render(row) {
        return row.category_id.name
      }
    },
    {
      title: '创建时间',
      key: 'created',
      render(row) {
        return dayjs(row.created).format('YYYY-MM-DD')
      }
    },
    //
    //   <n-popconfirm :show-icon="false">
    //   <template #trigger>
    //   <n-button>没图标</n-button>
    //   </template>
    // 就是这样
    // </n-popconfirm>
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return [h(
          NButton,
          {
            type: 'info',
            size: 'small',
            style: 'margin-right:10px',
            onClick: () => deleteArticle(row)
          },
          {default: () => '编辑'}
        ),
          h(NPopconfirm, {
              positiveText: "确认",
              negativeText: '取消',
              onPositiveClick: () => editArticle(row)
            }, {
              trigger: () => h(
                NButton,
                {
                  type: 'error',
                  size: 'small',
                },
                {default: () => '删除'}
              ),
              default: () => '确定要删除吗？',
            }
          )
        ]
      }
    }
  ]
}
