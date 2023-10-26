import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserOutlined, AppstoreOutlined, CarOutlined, CarFilled, CrownOutlined } from '@ant-design/icons';
import { Outlet, NavLink, useLocation, useNavigate, Router, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space, message, Avatar, Button } from 'antd';
import type { MenuProps } from 'antd';
import {borrowyoucarContract, nftContract, erc20Contract, web3} from "./utils/contracts";

const { Header, Content, Footer} = Layout;

const GanacheTestChainId = '0x539'
const GanacheTestChainName = 'Ganache Test Chain';
const GanacheTestChainRpcUrl = 'http://localhost:8545';

const items: MenuProps['items'] = [
  {
    label: 'Owned Car',
    key: 'ownedcar',
    icon: <CarOutlined />,
  },
  {
    label: 'Car Market',
    key: 'Carmarket',
    icon: <AppstoreOutlined />,
    children: [
      {
          type: 'group',
          label: 'View',
          children: [
            {
              label: 'All Cars',
              key: 'Carlistall',
            },
            {
              label: 'Only Free Cars',
              key: 'CarlistFree',
            },
          ],
      }
    ]
  },
  {
    label: 'User Profile',
    key: 'userprofile',
    icon: <CrownOutlined />,
  },
];

export default function App() {
    const {
      token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();
    const {pathname} = useLocation();
    const [currenthead, setCurrentHead] = useState(pathname);
    const pathSegments = pathname.split('/').filter((segment) => segment !== '');
    const [user, setUser] = useState('');
    const [IsLogin, setIsLogin] = useState(false); 
    const [userbalance, setUserbalance] = useState('');
    const [manager, setManager] = useState('');
    const [clearflag, setclearFlag] = useState(false);


    const onClick: MenuProps['onClick'] = (e) => {
        setclearFlag(false);
        const filter = sessionStorage.getItem('filter');
        if(filter != null) sessionStorage.removeItem('filter');
        if(e.key == 'ownedcar'){
            setCurrentHead(e.key);
            setIsLogin(false);
            navigate('/carowned');
        }
        else if(e.key == 'userprofile'){
            setCurrentHead(e.key);
            setIsLogin(false);
            navigate('/user');
        }
        else if(e.key == 'Carlistall' ){
            setCurrentHead(e.key);
            setIsLogin(false);
            sessionStorage.setItem('filter', 'all');
            navigate('/carmarket');
        }
        else if(e.key == 'CarlistFree'){
            setCurrentHead(e.key);
            setIsLogin(false);
            sessionStorage.setItem('filter', 'free');
            navigate('/carmarket');
        }
    };

    const onConnect = async() => {
      // @ts-ignore
      const {ethereum} = window;
      setclearFlag(true);
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }
        try {
          // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
          if (ethereum.chainId !== GanacheTestChainId) {
              const chain = {
                  chainId: GanacheTestChainId, // Chain-ID
                  chainName: GanacheTestChainName, // Chain-Name
                  rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
              };

              try {
                  // 尝试切换到本地网络
                  await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
              } catch (switchError: any) {
                  // 如果本地网络没有添加到Metamask中，添加该网络
                  if (switchError.code === 4902) {
                      await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                      });
                  }
              }
          }

          // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
          await ethereum.request({method: 'eth_requestAccounts'});
          // 获取小狐狸拿到的授权用户列表
          const accounts = await ethereum.request({method: 'eth_accounts'});
          // 如果用户存在，展示其account，否则显示错误信息
          // console.log(accounts)
          if(accounts && accounts.length > 0)
            setUser(accounts[0]);
          else
            throw new Error('No accounts found');
          sessionStorage.setItem('username', accounts[0]);
          const numPromise = erc20Contract.methods.balanceOf(accounts[0]).call();
          await numPromise.then((balance: string) => {
              setUserbalance(balance);
              sessionStorage.setItem('userbalance', balance);
          });
          setIsLogin(true);
          const event = new Event('userLoggedIn');
          window.dispatchEvent(event);

      } catch (error: any) {
          alert(error.message)
      }
    }

    const onQuit = async() => {
      setUser('');
      setIsLogin(false);
      setUserbalance('');
      setclearFlag(false);
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userbalance');

      const event = new Event('userLoggedOut');
        window.dispatchEvent(event);
    }

    useEffect(() =>{
          // 查看window对象里是否存在ethereum
        const initCheckAccounts = async() => {
            //@ts-ignore
            const {ehtereum} = window;
            if(Boolean(ehtereum && ehtereum.isMetaMask)){
                const accounts  = await web3.eth.getAccounts();
                // console.log(accounts);
                if(accounts && accounts.length > 0){
                    setUser(accounts[0]);
                    setIsLogin(true);
                    const numPromise = erc20Contract.methods.balanceOf(accounts[0]).call();
                    numPromise.then((balance: string) => {
                    setUserbalance(balance);
                      // sessionStorage.setItem('userbalance', balance);
                    });
                }
            }
        }

        const CheckNFTExpires = async() =>{
          if(nftContract){
              await nftContract.methods.Checkexpired().send({
                  from: user
              });
          }
          else{
              alert("nftContract not exists.");
          }
      }

      initCheckAccounts();
      if(user != '')
        CheckNFTExpires();
    }, [])

    useEffect(() => {
        const getBorrowYourCarcontractInfo = async() =>{
            if(borrowyoucarContract){
                const manager = await borrowyoucarContract.methods.manager().call();
                setManager(manager);
            }
            else{
                alert("Car Contract not exists.");
            }
        }
    },[])

    useEffect(() =>{
        const getAccountInfo = async() =>{
            if(erc20Contract && user){
                const numPromise = erc20Contract.methods.balanceOf(user).call();
                numPromise.then((num: string) => {
                  setUserbalance(num);
                  sessionStorage.setItem('userbalance', num);
                });
            }
            else {
                alert("ERC20 Contract not exists.")
            }
        }
        if(user != '')
            getAccountInfo();
    },[])

    useEffect(() => {
      setclearFlag(true)
    }, [{pathname}]);



    return (
        <Layout className="layout" style={{height: "100vh"}}>
        <Header style={{ display: 'flex', alignItems: 'center' , background: colorBgContainer}}>
            <div className='headerlist'>
              <Menu theme="light" onClick={onClick} selectedKeys={[currenthead]} mode="horizontal" items={items} />
            </div>
            <div className='buttonconnect' style={{marginLeft: 'auto', display: 'flex'}}>
              <Loginbuttton IsLogin={IsLogin} onConnect={onConnect} onQuit={onQuit}></Loginbuttton>
            </div>
        </Header>
        <Content style={{ padding: '0 50px', flex: '1'}}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>
                <Link to="/">car</Link>
              </Breadcrumb.Item>
              {pathSegments.map((segment, index) => (
                <Breadcrumb.Item key={index}>
                  <Link to={'/' + pathSegments.slice(0, index + 1).join('/')}>{segment}</Link>
                </Breadcrumb.Item>
               ))}
            </Breadcrumb>
           
            <div className="site-layout-content" style={{ background: colorBgContainer }}>
              <div style={{width:'95%', margin:'0 auto', maxHeight: '70vh', overflowY: 'auto'}}>
              {
                clearflag ? (<Outlet />) : (<div></div>)
              }
              </div>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    )
}

function Loginbuttton({ IsLogin, onConnect, onQuit }: { IsLogin: boolean; onConnect: () => void; onQuit: () => void; }){
  if(IsLogin == false)
    return  <Button type="primary" style={{width: '150px'} } onClick={onConnect}>连接钱包</Button>;
  else
    return  <Button type="primary" style={{width: '150px'} } onClick={onQuit}>退出</Button>;
}
