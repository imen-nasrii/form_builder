import { toast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { ReactNode } from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface EnhancedToastOptions {
  title: string
  description: string
  type?: ToastType
  duration?: number
  action?: ReactNode
}

const getToastConfig = (type: ToastType) => {
  const configs = {
    success: {
      icon: CheckCircle,
      variant: "success" as const,
      iconColor: "text-green-100",
    },
    error: {
      icon: AlertCircle,
      variant: "destructive" as const,
      iconColor: "text-red-100",
    },
    warning: {
      icon: AlertTriangle,
      variant: "warning" as const,
      iconColor: "text-amber-100",
    },
    info: {
      icon: Info,
      variant: "info" as const,
      iconColor: "text-blue-100",
    },
  }
  
  return configs[type] || configs.info
}

export const useEnhancedToast = () => {
  const showToast = ({ title, description, type = "info", duration = 5000, action }: EnhancedToastOptions) => {
    const config = getToastConfig(type)
    
    toast({
      title: title,
      description: description,
      variant: config.variant,
      duration,
      action,
    })
  }

  const showSuccess = (title: string, description: string, duration?: number) => {
    showToast({ title, description, type: "success", duration })
  }

  const showError = (title: string, description: string, duration?: number) => {
    showToast({ title, description, type: "error", duration })
  }

  const showWarning = (title: string, description: string, duration?: number) => {
    showToast({ title, description, type: "warning", duration })
  }

  const showInfo = (title: string, description: string, duration?: number) => {
    showToast({ title, description, type: "info", duration })
  }

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}