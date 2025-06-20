import React from 'react'
import ActiveSlider from '../components/ActiveSlideBar/ActiveSlider'
import FAQSection from '../components/FAQSection'
import ProcessSection from '../components/ProcessSection'
import CardFlip from '../components/CardFlip/FlipCardsSection'
import Header from '../components/Header/Header'

const Home = () => {
  return (
    <div>
      <Header />
      <ProcessSection />
      <CardFlip />
      <ActiveSlider />
      <FAQSection />
    </div>
  )
}

export default Home