import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { StButton } from './Button';
import logoimg from '../../img/logoImg.png';
import Search from '../../img/Search.png';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
// import todayTrip from '../public/todayTrip.png';

const Header = () => {
  // 로그인 유저를 state...?
  // const [loginUser, setLoginUser] = useState();

  const navigate = useNavigate('');

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      console.log('userUseEffect1', user);
    });
  }, []);

  const user = auth.currentUser;

  const logoutHandler = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <StHeader>
      <StLogo onClick={() => navigate('/')}>
        <StTravelimg src={logoimg} alt="오늘의 여행 로고" />
      </StLogo>
      {/* 검색창 */}
      <StContener>
        <StSearchText type="text" />
        <StSearchBtn>
          <StSearchimg src={Search} />
        </StSearchBtn>
        &nbsp;
        {/* 로그인버튼 */}
        <StButton $fontColor={'black'} onClick={() => navigate('/write')}>
          글쓰기
        </StButton>
        <StButton $fontColor={'black'}>회원가입</StButton>
        {user ? (
          <StButton onClick={logoutHandler} $btnSize="small">
            로그아웃
          </StButton>
        ) : (
          <>
            <button
              onClick={() => {
                navigate('/login');
              }}
            >
              로그인
            </button>
            <button
              onClick={() => {
                navigate('/join');
              }}
            >
              회원가입
            </button>
          </>
        )}
      </StContener>
    </StHeader>
  );
};

export default Header;

const StHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StLogo = styled.div`
  font-size: 22px;
  font-weight: 800;
`;
const StContener = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StSearchText = styled.input`
  width: 279px;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 12px;
  margin-right: 10px;
  margin-top: 10px;
  font-size: 18px;
  margin-bottom: 10px;
`;
const StTravelimg = styled.img`
  width: 200px;
`;

const StSearchBtn = styled.button`
  border: 0; /* 버튼의 border를 0으로 설정하여 안 보이도록 합니다. */
  background-color: transparent; /* 버튼의 배경을 투명으로 만듭니다. */
  width: 40px;
  height: 40px;
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
`;
const StSearchimg = styled.img`
  width: 33px;
  height: 34px;
`;
