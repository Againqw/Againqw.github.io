import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container">
      <div className="page-head" style={{ paddingBottom: 80 }}>
        <h1 className="page-head__title">404 · 页面走丢了</h1>
        <p className="page-head__summary">
          这个地址没有对应的内容。可能是链接过期，或者我把文章删了。
        </p>
        <p style={{ marginTop: 20 }}>
          <Link to="/" className="btn btn--primary">
            回到首页
          </Link>
        </p>
      </div>
    </div>
  )
}
