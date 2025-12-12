import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  white-space: nowrap;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  color: ${theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

// Removed header chat buttons per request

const Hero = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  color: white;
  padding: 4rem 5%;
  text-align: center;
  width: 100%;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 3rem 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  padding: 0 1rem;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1rem;
    padding: 0;
  }
`;

const Button = styled.button`
  background: white;
  color: ${theme.colors.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface LandingPageProps {
  onChatV2Click: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onChatV2Click }) => {
  return (
    <Container>
      <Header>
        <Logo>Annabel AI</Logo>
        <Nav>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          {/* Header chat buttons removed */}
        </Nav>
      </Header>
      
      <Hero>
        <HeroTitle>Your AI Assistant for Orthopaedic Care</HeroTitle>
        <HeroSubtitle>
          Get instant answers to your orthopaedic questions, powered by advanced AI technology.
        </HeroSubtitle>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
          <Button onClick={onChatV2Click} style={{ background: theme.colors.secondary, color: 'white' }}>Chat to Annabel</Button>
        </div>
      </Hero>
    </Container>
  );
};

export default LandingPage; 