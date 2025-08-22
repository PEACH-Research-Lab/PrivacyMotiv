import { useState, useMemo } from 'react'
// import reactLogo from './assets/react.svg'
import personaImage from './assets/persona.png'
import './PrivacyHarmAnalysis.css'

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
    story: string
    information_leaked: string
    flow_in_app: Array<{
      function: number
      flow_id: string
      step_causing_harm: string
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

interface PrivacyHarmAnalysisProps {
  selectedPersonas: Persona[]
  onBack: () => void
}

function PrivacyHarmAnalysis({ selectedPersonas, onBack }: PrivacyHarmAnalysisProps) {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [selectedHarmFilter, setSelectedHarmFilter] = useState<string>('all')
  const [hoveredSentence, setHoveredSentence] = useState<string>('')

  
  const currentPersona = selectedPersonas[currentPersonaIndex]
  const currentStory = currentPersona.stories?.[currentStoryIndex]

  // Get all unique harms across all stories for filtering
  const allHarms = useMemo(() => {
    const harms = new Set<string>()
    selectedPersonas.forEach(persona => {
      persona.stories?.forEach(story => {
        story.harms.forEach(harm => {
          harms.add(harm.harm)
        })
      })
    })
    return Array.from(harms)
  }, [selectedPersonas])

  // Filter stories based on selected harm
  const filteredStories = useMemo(() => {
    if (selectedHarmFilter === 'all') return currentPersona.stories || []
    return currentPersona.stories?.filter(story => 
      story.harms.some(harm => harm.harm === selectedHarmFilter)
    ) || []
  }, [currentPersona, selectedHarmFilter])

  const handleSwitchPersona = () => {
    setCurrentPersonaIndex((prevIndex) => (prevIndex + 1) % selectedPersonas.length)
    setCurrentStoryIndex(0) // Reset to first story when switching personas
  }

  const handleSwitchStory = () => {
    if (filteredStories.length > 0) {
      setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % filteredStories.length)
    }
  }

  const getPersonaDescription = (persona: Persona) => {
    const vulnerability = persona.contextual_info.vulnerability_type_brief_description.split(' - ')[1] || 
                        persona.contextual_info.vulnerability_type_brief_description
    return vulnerability
  }

  // Split story into sentences for hover functionality
  const storySentences = currentStory?.story.split('. ').filter(s => s.trim()) || []

  return (
    <div className="pha-container">
      {/* Enhanced Persona Profile Header */}
      <div className="pha-header">
        <div className="pha-persona-profile">
          <div className="pha-avatar">
            {(() => {
              const personaImageUrl = personaImage
              return (
                <div
                  className={`pha-avatar-circle ${personaImageUrl ? 'has-image' : 'placeholder'}`}
                  style={personaImageUrl ? { backgroundImage: `url(${personaImageUrl})` } : undefined}
                >
                  {!personaImageUrl && currentPersona.basic_info.name.charAt(0)}
                </div>
              )
            })()}
          </div>
          <div className="pha-persona-details">
            <div className="pha-name-age">
              <span className="pha-name">{currentPersona.basic_info.name}</span>
              <span className="pha-age">({currentPersona.basic_info.age} years old)</span>
            </div>
            <div className="pha-vulnerability">
              Persona type: {getPersonaDescription(currentPersona)}
            </div>
            <div className="pha-meta-and-cared">
              <div className="pha-meta-vertical">
                <div className="pha-meta-item">
                  <span className="pha-meta-label">Tech Comfort Level</span>
                  <span className="pha-tech-badge">{currentPersona.basic_info.tech_comfort_level}</span>
                </div>
                <div className="pha-meta-item">
                  <span className="pha-meta-label">Privacy Awareness</span>
                  <span className="pha-awareness-badge">{currentPersona.contextual_info.privacy_awareness_level}</span>
                </div>
              </div>
              <div className="pha-info-cared">
                <div className="pha-info-label">Information Cared:</div>
                <div className="pha-info-tags">
                  {currentPersona.contextual_info.information_cared_about.map((info, index) => (
                    <span key={index} className="pha-info-tag">
                      {info}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* <div className="pha-tech-level">
              Tech Comfort Level: <span className="pha-tech-badge">{currentPersona.basic_info.tech_comfort_level}</span>
              <span style={{ marginLeft: "1rem" }}></span>
              Privacy Awareness: <span className="pha-awareness-badge">{currentPersona.contextual_info.privacy_awareness_level}</span>
            </div> */}
            {/* <div className="pha-privacy-awareness">
              Privacy Awareness: <span className="pha-awareness-badge">{currentPersona.contextual_info.privacy_awareness_level}</span>
            </div> */}
          </div>
        </div>

        {/* <div className="pha-persona-stats">
          <div className="pha-stat-item">
            <div className="pha-stat-number">{currentPersona.stories?.length || 0}</div>
            <div className="pha-stat-label">Stories</div>
          </div>
          <div className="pha-stat-item">
            <div className="pha-stat-number">
              {currentPersona.stories?.reduce((total, story) => total + story.harms.length, 0) || 0}
            </div>
            <div className="pha-stat-label">Total Harms</div>
          </div>
          <div className="pha-stat-item">
            <div className="pha-stat-number">
              <div className="pha-stat-number">
              {currentPersona.contextual_info.information_cared_about.length}
            </div>
            <div className="pha-stat-label">Info Protected</div>
          </div>
        </div> */}

                <div className="pha-middle-section">
          <div className="pha-vertical-separator"></div>
          <div className="pha-privacy-overview">
            <div className="pha-privacy-tensions-compact">
              <div className="pha-compact-title">Privacy Tensions</div>
              <div className="pha-compact-content">
                {currentPersona.privacy_responses_and_costs.privacy_tensions_with_short_description.map((tension, index) => (
                  <div key={index} className="pha-compact-tension">
                    {tension}
                  </div>
                ))}
                {currentPersona.additional_privacy_responses_and_costs.privacy_tensions_with_short_description.map((tension, index) => (
                  <div key={index} className="pha-compact-tension additional">
                    {tension}
                  </div>
                ))}

              </div>
            </div>
            
            <div className="pha-privacy-responses-compact">
              <div className="pha-compact-title">Privacy Responses</div>
              <div className="pha-compact-content">
                {currentPersona.privacy_responses_and_costs.privacy_responses.map((response, index) => (
                  <div key={index} className="pha-compact-response">
                    <span className="pha-compact-response-type">{response.response}</span>
                    <span className="pha-compact-response-desc">
                      {response.description}
                    </span>
                  </div>
                ))}
                {currentPersona.additional_privacy_responses_and_costs.privacy_responses.map((response, index) => (
                  <div key={index} className="pha-compact-response additional">
                    <span className="pha-compact-response-type">{response.response}</span>
                    <span className="pha-compact-response-desc">
                      {response.description}
                    </span>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>

        <div className="pha-controls">
          <button className="pha-switch-btn" onClick={handleSwitchPersona}>
            Switch Persona ({currentPersonaIndex + 1}/{selectedPersonas.length})
          </button>
        </div>
        <button className="pha-back-btn back-top-left" onClick={onBack}>
          ← Back
        </button>
      </div>




      {/* Harm Filter Tags */}
      {/* <div className="pha-harm-filter">
        <div className="pha-filter-label">Filter by Harm Type:</div>
        <div className="pha-filter-tags">
          <button 
            className={`pha-filter-tag ${selectedHarmFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedHarmFilter('all')}
          >
            All Harms
          </button>
          {allHarms.map(harm => (
            <button 
              key={harm}
              className={`pha-filter-tag ${selectedHarmFilter === harm ? 'active' : ''}`}
              onClick={() => setSelectedHarmFilter(harm)}
            >
              {harm}
            </button>
          ))}
        </div>
      </div> */}

      {/* Main Content Layout */}
      <div className="pha-main-layout">
        {/* Left Section - Story Description */}
        <div className="pha-left-section">
          {/* Combined Story and Harms Block */}
          <div className="pha-story-block">
            <div className="pha-block-header">
              <div className="pha-block-title">Story Description & Harm Analysis</div>
              <div className="pha-story-controls">
                <span className="pha-story-counter">
                  Story {currentStoryIndex + 1} of {filteredStories.length}
                </span>
                <button 
                  className={`pha-story-switch-btn ${filteredStories.length <= 1 ? 'disabled' : ''}`}
                  onClick={handleSwitchStory}
                  disabled={filteredStories.length <= 1}
                >
                  Switch Story
                </button>
              </div>
            </div>
            <div className="pha-story-content">
              <div className="pha-story-text">
                {storySentences.map((sentence, index) => (
                  <span
                    key={index}
                    className="pha-sentence"
                    onMouseEnter={() => setHoveredSentence(sentence)}
                    onMouseLeave={() => setHoveredSentence('')}
                  >
                    {sentence.trim()}.
                  </span>
                ))}
              </div>
              
              <div className="pha-story-details">
                <div className="pha-detail-item">
                  <label>Information Leaked:</label>
                  <span>{currentStory?.information_leaked}</span>
                </div>
                <div className="pha-detail-item">
                  <label>Leakage Source:</label>
                  <span>{currentStory?.leakage_source}</span>
                </div>
                <div className="pha-detail-item">
                  <label>Leaked To:</label>
                  <span>{currentStory?.leak_to}</span>
                </div>
              </div>

              {/* Harms and Consequences Section */}
              <div className="pha-harms-section">
                <div className="pha-harms-title">Harms and Consequences</div>
                <div className="pha-harms-content">
                  {(() => {
                    // Group harms by cause
                    const harmsByCause = new Map<string, string[]>()
                    currentStory?.harms.forEach(harm => {
                      if (harmsByCause.has(harm.cause)) {
                        harmsByCause.get(harm.cause)!.push(harm.harm)
                      } else {
                        harmsByCause.set(harm.cause, [harm.harm])
                      }
                    })

                    return Array.from(harmsByCause.entries()).map(([cause, harmTypes], index) => (
                      <div key={index} className="pha-harm-item">
                        <div className="pha-harm-type">
                          {harmTypes.join(' / ')}
                        </div>
                        <div className="pha-harm-cause">{cause}</div>
                      </div>
                    ))
                  })()}
                  <div className="pha-consequences">
                    <label>Overall Consequences:</label>
                    <span>{currentStory?.consequences}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Lo-fi Prototype */}
        <div className="pha-right-section">
          <div className="pha-prototype-container">
            <div className="pha-prototype-title">Lo-fi Prototype</div>
            <div className="pha-prototype-content">
              {/* Function Flow Display */}
              <div className="pha-function-flow">
                <div className="pha-function-title">Story Flow:</div>
                <div className="pha-function-list">
                  {currentStory?.flow_in_app.map((flow, index) => {
                    let functionText = ''
                    switch (flow.function) {
                      case 1:
                        functionText = 'Viewing Friend Activity on the music app'
                        break
                      case 2:
                        functionText = 'Adding friends to the Friend Activity Feed via Facebook connection'
                        break
                      case 3:
                        functionText = 'Enjoying private listening via Private Session'
                        break
                      case 4:
                        functionText = 'Removing friends from the Friend Activity Feed'
                        break
                      default:
                        functionText = `Function ${flow.function}`
                    }
                    return (
                      <div key={index} className="pha-function-item">
                        <span className="pha-function-number">{flow.function}</span>
                        <span className="pha-function-text">{functionText}</span>
                        {/* <div className="pha-flow-details">
                          <span className="pha-flow-id">{flow.flow_id}</span>
                          <span className="pha-step-harm">{flow.step_causing_harm}</span>
                        </div> */}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hover Information */}
              {hoveredSentence ? (
                <div className="pha-hover-info">
                  <h4>Related Information:</h4>
                  <p>Sentence: "{hoveredSentence}"</p>
                  <p>This space will show the lo-fi prototype related to the hovered content.</p>
                  <div className="pha-prototype-placeholder">
                    <div className="pha-placeholder-item">1</div>
                    <div className="pha-placeholder-item">2</div>
                    <div className="pha-placeholder-item">3</div>
                  </div>
                </div>
              ) : (
                <div className="pha-prototype-placeholder">
                  <div className="pha-placeholder-item">1</div>
                  <div className="pha-placeholder-item">2</div>
                  <div className="pha-placeholder-item">3</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyHarmAnalysis