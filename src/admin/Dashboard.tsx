import { Link } from 'react-router-dom'
import { formatDate, publishedPosts, skillCount } from '../api'
import { useDB } from '../hooks/useDB'

export function Dashboard() {
  const db = useDB()
  const published = publishedPosts(db)
  const drafts = db.posts.filter((p) => p.status === 'draft')

  const metrics = [
    { label: '项目', value: db.projects.length, foot: `${db.projects.filter((p) => p.featured).length} 个精选` },
    { label: '已发布文章', value: published.length, foot: `最近 ${formatDate(published[0]?.publishedAt ?? '')}` },
    { label: '草稿', value: drafts.length, foot: '仅后台可见' },
    { label: '技能点', value: skillCount(db), foot: `${db.skills.length} 个分类` },
  ]

  const recentProjects = [...db.projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4)
  const recentPosts = [...db.posts]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4)

  return (
    <>
      <section className="admin__section">
        <div className="stats-grid">
          {metrics.map((m) => (
            <div className="metric" key={m.label}>
              <div className="metric__label">{m.label}</div>
              <div className="metric__value">{m.value}</div>
              <div className="metric__foot">{m.foot}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin__section">
        <div className="card">
          <div className="card__head">
            <div>
              <div className="card__title">快捷操作</div>
              <div className="card__desc">常用入口，改完保存即生效</div>
            </div>
          </div>
          <div className="row row--wrap">
            <Link to="/admin/projects" className="btn btn--sm">
              ＋ 新建项目
            </Link>
            <Link to="/admin/posts" className="btn btn--sm">
              ＋ 写文章
            </Link>
            <Link to="/admin/profile" className="btn btn--sm">
              修改个人信息
            </Link>
            <Link to="/admin/settings" className="btn btn--sm">
              站点设置
            </Link>
            <Link to="/" className="btn btn--sm btn--ghost">
              查看前台 ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="admin__section">
        <div className="card">
          <div className="card__head">
            <div>
              <div className="card__title">最近更新的项目</div>
              <div className="card__desc">按更新时间排序</div>
            </div>
            <div className="card__actions">
              <Link to="/admin/projects" className="btn btn--sm btn--ghost">
                全部
              </Link>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>标签</th>
                  <th>更新</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="table__title">{project.title}</div>
                      <div className="table__sub">/{project.slug}</div>
                    </td>
                    <td>
                      <span className="chip">{project.tags[0] ?? '—'}</span>
                    </td>
                    <td className="table__sub">{formatDate(project.updatedAt)}</td>
                    <td>
                      <div className="table__actions">
                        <Link to={`/projects/${project.slug}`} className="btn btn--sm btn--ghost">
                          查看
                        </Link>
                        <Link to="/admin/projects" className="btn btn--sm">
                          编辑
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="admin__section">
        <div className="card">
          <div className="card__head">
            <div>
              <div className="card__title">最近的文章</div>
              <div className="card__desc">
                共 {db.posts.length} 篇，{drafts.length} 篇草稿，收到 {db.messages.length} 条留言
              </div>
            </div>
            <div className="card__actions">
              <Link to="/admin/posts" className="btn btn--sm btn--ghost">
                全部
              </Link>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>状态</th>
                  <th>日期</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="table__title">{post.title}</div>
                      <div className="table__sub">/{post.slug}</div>
                    </td>
                    <td>
                      <span className={`badge ${post.status === 'draft' ? 'badge--draft' : ''}`}>
                        {post.status === 'draft' ? '草稿' : '已发布'}
                      </span>
                    </td>
                    <td className="table__sub">{formatDate(post.publishedAt)}</td>
                    <td>
                      <div className="table__actions">
                        <Link to="/admin/posts" className="btn btn--sm">
                          编辑
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
