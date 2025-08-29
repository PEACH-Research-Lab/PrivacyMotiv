import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import personaImage from './assets/persona.png'
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

interface PrivacyHarmAnalysisProps {
  selectedPersonas: Persona[]
  selectedApp: 'APP1' | 'APP2'
  onBack: () => void
}

function PrivacyHarmAnalysis({ selectedPersonas, selectedApp, onBack }: PrivacyHarmAnalysisProps) {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0)
  const [hoveredSentence, setHoveredSentence] = useState<string>('')
  const [selectedFlowIndex, setSelectedFlowIndex] = useState<number | null>(null)
  const [imageZoom, setImageZoom] = useState(1)
  const [imageLoadError, setImageLoadError] = useState<boolean>(false)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Reset image error when persona changes
  useEffect(() => {
    setImageLoadError(false)
    setImagePosition({ x: 0, y: 0 })
    setImageZoom(1)
    console.log(`Switched to persona: ${currentPersona.basic_info.name}, App: ${selectedApp}`)
  }, [currentPersonaIndex, selectedApp])

  // Mouse drag handlers for image panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const resetImageView = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }
  
  const currentPersona = selectedPersonas[currentPersonaIndex]
  const currentStory = currentPersona.stories?.[0]



  const handleSwitchPersona = () => {
    setCurrentPersonaIndex((prevIndex) => (prevIndex + 1) % selectedPersonas.length)
  }

  const getPersonaDescription = (persona: Persona) => {
    const vulnerability = persona.contextual_info.vulnerability_type_brief_description.split(' - ')[1] || 
                        persona.contextual_info.vulnerability_type_brief_description
    return vulnerability
  }

  const getPersonaImage = (personaName: string) => {
    // Get the persona-specific image based on the selected app
    const appFolder = selectedApp === 'APP1' ? 'app1_persona' : 'app2_persona'
    // const imagePath = `/src/assets/${appFolder}/${personaName}.png`
    // const imagePath = `/PrivacyMotiv/${appFolder}/${personaName}.png`
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const basePath = isLocalhost ? '' : '/PrivacyMotiv'
    const imagePath = `${basePath}/${appFolder}/${personaName}.png`
  
    console.log(`Constructing image path: ${imagePath} for persona: ${personaName} in app: ${selectedApp}`)
    return imagePath
  }

  const getLofiImagePath = (personaName: string, flowFunction: number, size: 'small' | 'big') => {
    // Get the lo-fi prototype image based on the selected app, persona, and flow function
    const appFolder = selectedApp === 'APP1' ? 'App1' : 'App2'
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const basePath = isLocalhost ? '' : '/PrivacyMotiv'
    const imagePath = `${basePath}/lofi_collections/${appFolder}/${personaName}/${personaName}_${flowFunction}_${size}.png`
  
    console.log(`Constructing lo-fi image path: ${imagePath} for persona: ${personaName}, flow: ${flowFunction}, size: ${size} in app: ${selectedApp}`)
    return imagePath
  }

  const handleImageError = () => {
    console.log(`Failed to load image for ${currentPersona.basic_info.name} from ${selectedApp}`)
    setImageLoadError(true)
  }

  const handleImageLoad = () => {
    console.log(`Successfully loaded image for ${currentPersona.basic_info.name} from ${selectedApp}`)
    setImageLoadError(false)
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
              const personaImageUrl = getPersonaImage(currentPersona.basic_info.name)
              const isDefaultImage = imageLoadError
              
              console.log(`Rendering avatar for ${currentPersona.basic_info.name}:`, {
                imageUrl: personaImageUrl,
                isDefaultImage,
                selectedApp,
                imageLoadError
              })
              
              return (
                <div className={`pha-avatar-circle ${!isDefaultImage ? 'has-image' : 'placeholder'}`}>
                  {!isDefaultImage ? (
                    <img
                      src={personaImageUrl}
                      alt={`${currentPersona.basic_info.name} persona`}
                      className="pha-persona-image"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    currentPersona.basic_info.name.charAt(0)
                  )}
                </div>
              )
            })()}
          </div>
                           <div className="pha-persona-details">
                   <div className="pha-name-age">
                     <span className="pha-name">{currentPersona.basic_info.name}</span>
                     <span className="pha-age">({currentPersona.basic_info.age} years old)</span>
                   </div>
                   <div className="pha-persona-identity">
                     {currentPersona.stories?.[0]?.persona_identity}
                   </div>
                    <div className="pha-vulnerability">
                      Persona type: {getPersonaDescription(currentPersona)}
                    </div>
                    
                    {/* Information Cared Section - Right under persona type */}
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
                    
                    {/* Tech and Privacy Meta Info */}
                    {/* <div className="pha-meta-vertical"> */}
                      {/* <div className="pha-meta-item">
                        <span className="pha-meta-label">Tech Comfort Level</span>
                        <span className="pha-tech-badge">{currentPersona.basic_info.tech_comfort_level}</span>
                      </div>
                      <div className="pha-meta-item">
                        <span className="pha-meta-label">Privacy Awareness</span>
                        <span className="pha-awareness-badge">{currentPersona.contextual_info.privacy_awareness_level}</span>
                      </div> */}
                    {/* </div> */}
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


      {/* Main Content Layout */}
      <div className="pha-main-layout">
        {/* Left Section - Story Description */}
        <div className="pha-left-section">
          {/* Combined Story and Harms Block */}
          <div className="pha-story-block">
            <div className="pha-block-header">
              <div className="pha-block-title">Story Description & Harm Analysis</div>
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
          
          {/* Design Problems Form - Under Story Description */}
          {/* <div className="pha-form-section pha-form-left">
            <div className="pha-form-container">
              <div className="pha-form-header">
                <h3>Design Problems Identification</h3>
              </div>
              <div className="pha-form-content">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfA8OV1mFHyzodtisJsyBzUjtHBwzFzGSeetnp2WQreYwM3OQ/viewform?usp=dialog"
                  width="100%"
                  height="500"
                  title="Design Problems Form"
                  className="pha-embedded-form"
                >
                  Loading
                </iframe>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Section - Lo-fi Prototype */}
        <div className="pha-right-section">
          <div className="pha-prototype-container">
            <div className="pha-prototype-title">Persona Usage Flow</div>
            <div className="pha-prototype-content">
              {/* Function Flow Display with Lo-fi Prototypes */}
              <div className="pha-function-flow">
                <div className="pha-function-title">Story Flow:</div>
                <div className="pha-function-list">
                  {currentStory?.flow_in_app.map((flow, index) => {
                                         let functionText = ''
                     if (selectedApp === 'APP1') {
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
                     } else if (selectedApp === 'APP2') {
                       switch (flow.function) {
                         case 1:
                           functionText = 'Finding and Watching NN Live+ Streams Nearby'
                           break
                         case 2:
                           functionText = 'Commenting and Reacting on NN Live+'
                           break
                         case 3:
                           functionText = 'Going NN Live+ to Alert Neighbors'
                           break
                         case 4:
                           functionText = 'Hiding and Deleting Your Live+ History'
                           break
                         default:
                           functionText = `Function ${flow.function}`
                       }
                     }
                    return (
                      <div key={index} className="pha-function-item">
                        <div className="pha-function-header">
                          <span className="pha-function-number">{flow.function}</span>
                          <span className="pha-function-text">{functionText}</span>
                        </div>
                        {/* <div className="pha-flow-details">
                          <span className="pha-flow-id">{flow.flow_id}</span>
                          <div className="pha-step-harm-list">
                            {flow.step_causing_harm.map((step, stepIndex) => (
                              <span key={stepIndex} className="pha-step-harm">
                                {step}
                              </span>
                            ))}
                          </div>
                        </div> */}
                        
                        {/* Lo-fi Prototype for this flow */}
                        <div className="pha-lofi-flow-item">
                          {/* <div className="pha-lofi-flow-title">
                            Lo-fi Prototype
                          </div> */}
                          <div className="pha-lofi-flow-content">
                            <div 
                              className="pha-lofi-small-version"
                              onClick={() => {
                                setSelectedFlowIndex(index)
                                setImageZoom(1)
                              }}
                            >
                                                             <img 
                                 src={getLofiImagePath(currentPersona.basic_info.name, flow.function, 'small')}
                                 alt={`Flow ${flow.function} small version`}
                                 className="pha-lofi-small-image"
                                 onError={(e) => {
                                   // Fallback to example image if persona-specific image not found
                                   const target = e.target as HTMLImageElement
                                   target.src = './lofi_collections/example_small.png'
                                 }}
                               />
                              <div className="pha-lofi-click-hint">Click to view full flow</div>
                            </div>
                          </div>
                        </div>
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
                </div>
              ) : null}
            </div>
          </div>
          
          {/* Design Suggestions Form - Under Persona Usage Flow */}
          <div className="pha-form-section pha-form-right">
            <div className="pha-form-container">
              <div className="pha-form-header">
                <h3>Design Suggestions</h3>
                {/* <p>What alternative design idea would you suggest to address this problem? Please describe how it would improve the user's experience or reduce harm.</p> */}
              </div>
              <div className="pha-form-content">
                {/* <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSdmHl-2J6r7993cMZPHLT-7NWXiX6VUIkekKBFtZYJGbTUlsw/viewform?usp=dialog"
                  width="100%"
                  height="500"
                  title="Design Suggestions Form"
                  className="pha-embedded-form"
                >
                  Loading
                </iframe> */}
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSda2uHUtxADNRF7vf30PIK7HpM9lq9K5sIFv7gOYc6psYHCPw/viewform"
                  width="100%"
                  height="500"
                  title="Design Suggestions Form"
                  className="pha-embedded-form"
                >
                  Loading
                </iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Flow Modal - Big Version */}
        {selectedFlowIndex !== null && (
          <div className="pha-flow-modal-overlay" onClick={() => setSelectedFlowIndex(null)}>
            <div className="pha-flow-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pha-flow-modal-header">
                                 <h3>Flow {currentStory?.flow_in_app[selectedFlowIndex]?.function}: {
                   (() => {
                     const flow = currentStory?.flow_in_app[selectedFlowIndex]
                     if (!flow) return ''
                     if (selectedApp === 'APP1') {
                       switch (flow.function) {
                         case 1:
                           return 'Viewing Friend Activity on the music app'
                         case 2:
                           return 'Adding friends to the Friend Activity Feed via Facebook connection'
                         case 3:
                           return 'Enjoying private listening via Private Session'
                         case 4:
                           return 'Removing friends from the Friend Activity Feed'
                         default:
                           return `Function ${flow.function}`
                       }
                     } else if (selectedApp === 'APP2') {
                       switch (flow.function) {
                         case 1:
                           return 'Finding and Watching NN Live+ Streams Nearby'
                         case 2:
                           return 'Commenting and Reacting on NN Live+'
                         case 3:
                           return 'Going NN Live+ to Alert Neighbors'
                         case 4:
                           return 'Hiding and Deleting Your Live+ History'
                         default:
                           return `Function ${flow.function}`
                       }
                     }
                     return `Function ${flow.function}`
                   })()
                 }</h3>
                <button 
                  className="pha-flow-modal-close"
                  onClick={() => setSelectedFlowIndex(null)}
                >
                  ×
                </button>
              </div>
              <div className="pha-flow-modal-content">
                {/* Zoom Controls */}
                <div className="pha-zoom-info">
                  <div className="pha-zoom-level">Zoom: {Math.round(imageZoom * 100)}%</div>
                  <div className="pha-zoom-hint">Scroll to zoom, drag to pan when zoomed in</div>
                  <button className="pha-zoom-reset" onClick={resetImageView}>
                    Reset View
                  </button>
                </div>
                
                <div 
                  className="pha-image-container"
                  onWheel={(e) => {
                    e.preventDefault()
                    const delta = e.deltaY > 0 ? -0.1 : 0.1
                    setImageZoom(prev => Math.max(0.5, Math.min(6, prev + delta)))
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: isDragging ? 'grabbing' : imageZoom > 1 ? 'grab' : 'zoom-in' }}
                >
                  <img 
                    src={getLofiImagePath(currentPersona.basic_info.name, currentStory?.flow_in_app[selectedFlowIndex]?.function || 1, 'big')}
                    alt={`Flow ${currentStory?.flow_in_app[selectedFlowIndex]?.function} big version`}
                    className="pha-lofi-big-image"
                    style={{ 
                      transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                      cursor: isDragging ? 'grabbing' : imageZoom > 1 ? 'grab' : 'zoom-in'
                    }}
                    draggable={false}
                    onError={(e) => {
                      // Fallback to example image if persona-specific image not found
                      const target = e.target as HTMLImageElement
                      target.src = './lofi_collections/example_big.png'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PrivacyHarmAnalysis