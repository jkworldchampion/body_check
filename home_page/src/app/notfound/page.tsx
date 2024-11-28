import Link from 'next/link'

function NotFound() {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80%',
            textAlign: 'center'

        }}>
            <Link href="/"  passHref style={{ textDecoration: 'none',color:'black' }}>
                <h1>Not found – 404!</h1>
            </Link>
            <div>
                <p>페이지를 찾을 수 없습니다.<br></br>
                    홈으로 돌아가세요.</p>
            </div>
        </div>
    )
}

export default NotFound;
