import { useState, useEffect } from 'react'
import './App.css'
import PrivacyHarmAnalysis from './PrivacyHarmAnalysis'

interface Persona {
  basic_info: {
    name: string
    age: number
    tech_comfort_level: string
  }
  contextual_info: {
    vulnerability_type_brief_description: string
    privacy_awareness_level: string
    information_cared_about: string[]
  }
  privacy_responses_and_costs: {
    privacy_tensions_with_short_description: string[]
    privacy_responses: Array<{
      response: string
      description: string
    }>
    costs_and_consequences: string[]
  }
  additional_privacy_responses_and_costs: {
    privacy_tensions_with_short_description: string[]
    privacy_responses: Array<{
      response: string
      description: string
    }>
    costs_and_consequences: string[]
  }
  stories?: Array<{
    persona_identity: string
    story: string
    information_leaked: string
    flow_in_app: Array<{
      function: number
      flow_id: string
      step_causing_harm: string[]
      design_problems: string[]
    }>
    leakage_source: string
    leak_to: string
    harms: Array<{
      harm: string
      cause: string
    }>
    consequences: string
  }>
}

function App() {
  const [selectedApp, setSelectedApp] = useState<'APP1' | 'APP2'>('APP1')
  const [selectedPersonas, setSelectedPersonas] = useState<number[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [currentPage, setCurrentPage] = useState<'selection' | 'analysis'>('selection')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load personas from the JSON file based on selected app
    const loadPersonas = async () => {
      try {
        const fileName = selectedApp === 'APP1' ? 'app1_persona.json' : 'app2_persona.json'
        // const response = await fetch(`/src/assets/${fileName}`)
        // const response = await fetch(`/PrivacyMotiv/${fileName}`)
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        const basePath = isLocalhost ? '' : '/PrivacyMotiv'
        const response = await fetch(`${basePath}/${fileName}`)
        const data = await response.json()
        setPersonas(data)
      } catch (error) {
        console.error('Error loading personas:', error)
        // Fallback to hardcoded data if JSON loading fails
        const fallbackData = [
          {
            "basic_info": {
              "name": "Amina",
              "age": 12,
              "tech_comfort_level": "low"
            },
            "contextual_info": {
              "vulnerability_type_brief_description": "Discrimination due to refugee status",
              "privacy_awareness_level": "low",
              "information_cared_about": ["location", "immigration status", "identity documents"]
            },
            "privacy_responses_and_costs": {
              "privacy_tensions_with_short_description": [
                "Privacy vs. Support - afraid to identify to receive assistance",
                "Privacy vs. Disclosure of identity - risk of stigma or denial of aid"
              ],
              "privacy_responses": [
                {
                  "response": "Apathy",
                  "description": "Feels surveillance is inevitable, so avoids acting or reporting."
                },
                {
                  "response": "Non-use",
                  "description": "Avoids official portals or apps to not expose status."
                }
              ],
              "costs_and_consequences": [
                "Missed access to legal aid, medical care, or language support",
                "Continued vulnerability without reporting abuse or needs"
              ]
            },
            "additional_privacy_responses_and_costs": {
                "privacy_tensions_with_short_description": [
                    "Privacy vs. Safety - reluctance to disclose refugee status to protect from harassment or threats",
                    "Privacy vs. Community engagement - fear of harassment reduces participation in supportive spaces",
                    "Privacy vs. Public presence - online hostility pressures refugees to retreat from digital spaces"
                ],
                "privacy_responses": [
                {
                    "response": "Avoidance of disclosure",
                    "description": "Chooses not to share refugee status or personal information online or with unfamiliar organizations."
                },
                {
                    "response": "Self-censorship",
                    "description": "Avoids posting personal stories or identifiable details online to prevent harassment or doxxing."
                },
                {
                    "response": "Withdrawal from platforms",
                    "description": "Stops using social media after repeated harassment tied to refugee identity."
                }
                ],
                "costs_and_consequences": [
                    "Limited ability to use digital services that could provide beneficial resources",
                    "Loss of emotional and social support from online communities",
                    "Reduced access to information, opportunities, and advocacy networks"
                ]
            }
          }
        ]
        setPersonas(fallbackData)
      }
    }
    
    loadPersonas()
  }, [selectedApp])

  const handlePersonaSelect = (index: number) => {
    if (selectedPersonas.includes(index)) {
      // Remove persona if already selected
      setSelectedPersonas(selectedPersonas.filter(i => i !== index))
    } else if (selectedPersonas.length < 3) {
      // Add persona if less than 3 are selected
      setSelectedPersonas([...selectedPersonas, index])
    }
  }

  const handleNext = () => {
    if (selectedPersonas.length === 3) {
      setCurrentPage('analysis')
    }
  }

  const handleBack = () => {
    setCurrentPage('selection')
  }

  // Check if a persona matches the search term
  const personaMatchesSearch = (persona: Persona, searchTerm: string) => {
    if (!searchTerm) return false
    
    const searchLower = searchTerm.toLowerCase()
    const description = persona.contextual_info.vulnerability_type_brief_description.toLowerCase()
    const name = persona.basic_info.name.toLowerCase()
    const techLevel = persona.basic_info.tech_comfort_level.toLowerCase()
    const privacyLevel = persona.contextual_info.privacy_awareness_level.toLowerCase()
    const infoCaredAbout = persona.contextual_info.information_cared_about.join(' ').toLowerCase()
    
    return description.includes(searchLower) || 
           name.includes(searchLower) || 
           techLevel.includes(searchLower) || 
           privacyLevel.includes(searchLower) || 
           infoCaredAbout.includes(searchLower)
  }

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    )
  }

  // If we're on the analysis page, show the PrivacyHarmAnalysis component
  if (currentPage === 'analysis') {
    const selectedPersonasData = selectedPersonas.map(i => personas[i])
          return <PrivacyHarmAnalysis selectedPersonas={selectedPersonasData} selectedApp={selectedApp} onBack={handleBack} />
  }

  // Otherwise, show the persona selection page
  return (
    <div className="privacy-motiv-container">
      {/* Title */}
      <div className="privacy-motiv-title">
        PrivacyMotiv: Speculating Unintended Creepiness
      </div>

      {/* Instructions */}
      <div className="privacy-motiv-instructions">
        Choose 3 different personas to explore their privacy-invasive journey story. Each persona shows their vulnerability type and the information they care about protecting.
      </div>

      {/* App Selection Buttons */}
      <div className="app-selection">
        <button 
          className={`app-button ${selectedApp === 'APP1' ? 'active' : ''}`}
          onClick={() => setSelectedApp('APP1')}
        >
          WeMusic
        </button>
        <button 
          className={`app-button ${selectedApp === 'APP2' ? 'active' : ''}`}
          onClick={() => setSelectedApp('APP2')}
        >
          NeighborNet
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search personas by keywords (e.g., 'refugee', 'elderly', 'anxiety', 'disability')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            {personas.slice(0, 20).filter(persona => personaMatchesSearch(persona, searchTerm)).length} persona{personas.slice(0, 20).filter(persona => personaMatchesSearch(persona, searchTerm)).length !== 1 ? 's' : ''} matching "{searchTerm}" (highlighted below)
          </div>
        )}
      </div>

      {/* Persona Grid */}
      <div className="persona-grid">
        {personas.slice(0, 20).map((persona, index) => {
          const isSelected = selectedPersonas.includes(index)
          const isHighlighted = searchTerm && personaMatchesSearch(persona, searchTerm)
          
          return (
            <div 
              key={index}
              className={`persona-box ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
              onClick={() => handlePersonaSelect(index)}
            >
              {/* <div className="persona-name">perso{index + 1}</div> */}
              <div className="persona-description">
                {highlightText(
                  persona.contextual_info.vulnerability_type_brief_description.split(' - ')[1] || 
                  persona.contextual_info.vulnerability_type_brief_description, 
                  searchTerm
                )}
              </div>
              <div className="persona-info-section">
                <div className="persona-info-cared">
                  {persona.contextual_info.information_cared_about.map((info, infoIndex) => (
                    <span key={infoIndex} className="info-tag">
                      {highlightText(info, searchTerm)}
                    </span>
                  ))}
                </div>
              </div>
              {isSelected && (
                <div className="selection-badge">
                  {selectedPersonas.indexOf(index) + 1}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Next Button */}
      <button 
        className={`next-button ${selectedPersonas.length === 3 ? 'active' : ''}`}
        onClick={handleNext}
        disabled={selectedPersonas.length !== 3}
      >
        Next
      </button>
    </div>
  )
}

export default App

