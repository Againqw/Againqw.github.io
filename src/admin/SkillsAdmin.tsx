import { useState } from 'react'
import { api, newId } from '../api'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'
import type { SkillGroup, SkillItem } from '../types'

export function SkillsAdmin() {
  const db = useDB()
  const [groups, setGroups] = useState<SkillGroup[]>(() =>
    db.skills.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i })) })),
  )

  const patchGroup = (index: number, patch: Partial<SkillGroup>) => {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)))
  }

  const patchItem = (groupIndex: number, itemIndex: number, patch: Partial<SkillItem>) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, items: g.items.map((item, j) => (j === itemIndex ? { ...item, ...patch } : item)) }
          : g,
      ),
    )
  }

  const saveGroup = (index: number) => {
    const group = groups[index]
    if (!group.name.trim()) {
      toast('分组名称不能为空', 'error')
      return
    }
    if (group.items.some((item) => !item.name.trim())) {
      toast('有技能名称为空，请先补全', 'error')
      return
    }
    const result = api.saveSkillGroup({
      ...group,
      name: group.name.trim(),
      items: group.items.map((item) => ({ ...item, name: item.name.trim(), note: item.note?.trim() })),
    })
    if (result.ok) toast(`「${group.name}」已保存`)
    else toast(result.error ?? '保存失败', 'error')
  }

  const addGroup = () => {
    const group: SkillGroup = { id: newId('g'), name: '', items: [] }
    setGroups((prev) => [...prev, group])
  }

  const removeGroup = (index: number) => {
    const group = groups[index]
    if (!window.confirm(`确定删除分组「${group.name || '未命名'}」及其 ${group.items.length} 项技能吗？`)) return
    api.deleteSkillGroup(group.id)
    setGroups((prev) => prev.filter((_, i) => i !== index))
    toast('分组已删除', 'info')
  }

  return (
    <div className="form">
      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title">技能分组</div>
            <div className="card__desc">
              熟练度 1–5 对应进度条长度；修改后点「保存本组」才会写入前台
            </div>
          </div>
          <div className="card__actions">
            <button type="button" className="btn btn--sm" onClick={addGroup}>
              ＋ 新建分组
            </button>
          </div>
        </div>

        <div className="repeater">
          {groups.map((group, groupIndex) => (
            <div className="repeater__row" key={group.id} style={{ gap: 14 }}>
              <div className="row">
                <input
                  className="input"
                  placeholder="分组名称，如 后端开发"
                  value={group.name}
                  onChange={(e) => patchGroup(groupIndex, { name: e.target.value })}
                />
                <span className="table__sub">{group.items.length} 项</span>
              </div>

              <div className="repeater">
                {group.items.map((item, itemIndex) => (
                  <div className="repeater__row repeater__row--skill" key={item.id}>
                    <input
                      className="input"
                      placeholder="技能名称"
                      value={item.name}
                      onChange={(e) => patchItem(groupIndex, itemIndex, { name: e.target.value })}
                    />
                    <select
                      className="select"
                      value={item.level}
                      onChange={(e) => patchItem(groupIndex, itemIndex, { level: Number(e.target.value) })}
                      aria-label={`${item.name || '技能'}熟练度`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {'■'.repeat(n)} {n}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      placeholder="备注（可选）"
                      value={item.note ?? ''}
                      onChange={(e) => patchItem(groupIndex, itemIndex, { note: e.target.value })}
                    />
                    <button
                      type="button"
                      className="btn btn--sm btn--danger"
                      onClick={() =>
                        patchGroup(groupIndex, {
                          items: group.items.filter((_, i) => i !== itemIndex),
                        })
                      }
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>

              <div className="row">
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() =>
                    patchGroup(groupIndex, {
                      items: [...group.items, { id: newId('s'), name: '', level: 3, note: '' }],
                    })
                  }
                >
                  ＋ 添加技能
                </button>
                <button type="button" className="btn btn--sm btn--primary" onClick={() => saveGroup(groupIndex)}>
                  保存本组
                </button>
                <button type="button" className="btn btn--sm btn--danger" onClick={() => removeGroup(groupIndex)}>
                  删除分组
                </button>
              </div>
            </div>
          ))}
          {groups.length === 0 && <div className="empty">还没有技能分组</div>}
        </div>
      </div>
    </div>
  )
}
