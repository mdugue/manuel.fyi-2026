'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { aiModels, type AiModelId } from '@/i18n/ai-models'

const MODEL_COUNT = aiModels.length

export function useModelCycler(onModelChange: (model: AiModelId) => void) {
  const [modelIndex, setModelIndex] = useState(0)

  const onChangeRef = useRef(onModelChange)
  useEffect(() => {
    onChangeRef.current = onModelChange
  })

  const currentModel = aiModels[modelIndex]!
  const nextIndex = (modelIndex + 1) % MODEL_COUNT
  const nextModel = aiModels[nextIndex]!

  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    onChangeRef.current(currentModel.id)
  }, [currentModel.id])

  const regenerate = useCallback(() => {
    setModelIndex(nextIndex)
    onChangeRef.current(aiModels[nextIndex]!.id)
  }, [nextIndex])

  const position = `${String(modelIndex + 1).padStart(2, '0')}/${String(MODEL_COUNT).padStart(2, '0')}`

  return { currentModel, nextModel, position, regenerate }
}
