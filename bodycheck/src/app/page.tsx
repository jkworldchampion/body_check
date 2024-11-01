import Link from 'next/link';



export default function Home() {
  return (
      <div style={{textAlign:'left',marginTop:'300px',marginLeft:'50px'}}>
          <Link href="/">
              <button>BODY:CHECK</button>
          </Link>
          <Link href="/login">
              <button>로그인</button>
          </Link>
          <Link href="/inquiry">
              <button>문의사항</button>
          </Link>
          <h1 style={{fontSize:'40px'}}>체형맞춤형 운동추천</h1>
          <h2 style={{fontSize:'100px',fontWeight:'bold'}}>BODY CHECK</h2>
          <Link href="/start" >
              <button >서비스 시작하기</button>
          </Link>



      </div>
  );
}
