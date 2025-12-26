import React, { useState } from 'react'
import { LearningResource, PlatformLink } from '../lib/types'
import { LearningPlatformService } from '../lib/services/learningPlatformService'
import { ExternalLink } from 'lucide-react'

interface PlatformLinkCardProps {
  resource: LearningResource
  className?: string
}

export const PlatformLinkCard: React.FC<PlatformLinkCardProps> = ({ 
  resource, 
  className = '' 
}) => {
  // Generate platform links if not already present
  const platformLinks = resource.platformLinks || LearningPlatformService.generatePlatformLinks(resource)
  
  // State to track clicked buttons for visual feedback
  const [clickedButtons, setClickedButtons] = useState<Set<string>>(new Set())
  
  // Debug logging
  console.log('Resource:', resource.title, 'Platform links:', platformLinks)
  
  // If no platform links generated, show error
  if (!platformLinks || platformLinks.length === 0) {
    console.error('No platform links generated for resource:', resource)
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800 text-sm">Error: Could not generate platform links for "{resource.title}"</p>
      </div>
    )
  }

  const handleLinkClick = (link: PlatformLink) => {
    // Track click (simple console log for now)
    console.log(`Clicked ${link.platform} for resource: ${resource.title}`)
    
    // Add visual feedback
    setClickedButtons(prev => new Set(prev).add(link.platform))
    
    // Remove the clicked state after a short delay
    setTimeout(() => {
      setClickedButtons(prev => {
        const newSet = new Set(prev)
        newSet.delete(link.platform)
        return newSet
      })
    }, 2000)
    
    // Open in new tab
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Resource Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {resource.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {resource.type && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {resource.type}
            </span>
          )}
          {resource.duration && <span>{resource.duration}</span>}
          {resource.difficulty && <span>{resource.difficulty}</span>}
        </div>
      </div>

      {/* Platform Links */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Available on:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {platformLinks.map((link) => (
            <button
              key={link.platform}
              onClick={() => handleLinkClick(link)}
              className={`
                flex items-center justify-between p-4 rounded-xl border-2 
                transition-all duration-200 transform group relative overflow-hidden
                ${clickedButtons.has(link.platform)
                  ? 'border-green-400 bg-green-100 shadow-lg scale-105 dark:border-green-500 dark:bg-green-900/40'
                  : link.isRecommended 
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 hover:shadow-lg hover:scale-105 active:scale-95 active:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/40' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:scale-102 active:scale-98 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              aria-label={`View ${resource.title} on ${link.displayName}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl transition-transform group-hover:scale-110" role="img" aria-label={link.displayName}>
                  {link.logo}
                </span>
                <div className="text-left">
                  <span className={`text-sm font-semibold block ${
                    clickedButtons.has(link.platform)
                      ? 'text-green-800 dark:text-green-200'
                      : link.isRecommended 
                        ? 'text-blue-800 dark:text-blue-200' 
                        : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {link.displayName}
                  </span>
                  {clickedButtons.has(link.platform) ? (
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full font-medium">
                      ✓ Opening...
                    </span>
                  ) : link.isRecommended && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full font-medium">
                      ⭐ Recommended
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className={`w-5 h-5 transition-all duration-200 ${
                clickedButtons.has(link.platform)
                  ? 'text-green-600 animate-pulse'
                  : link.isRecommended 
                    ? 'text-blue-500 group-hover:text-blue-600 group-hover:translate-x-1' 
                    : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
              } dark:group-hover:text-gray-300`} />
              
              {/* Success ripple effect */}
              {clickedButtons.has(link.platform) && (
                <div className="absolute inset-0 bg-green-400 opacity-20 animate-ping rounded-xl"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      {resource.skills && resource.skills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skills you'll learn:
          </h4>
          <div className="flex flex-wrap gap-1">
            {resource.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlatformLinkCard