"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { authClient } from "@/features/auth/client"

export interface UserMenuProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * User dropdown menu with profile info and plan details
 * Consolidates user actions and plan information
 */
export function UserMenu({ className }: UserMenuProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user
  const userName = user?.name || "Usuário"
  const userEmail = user?.email || ""
  const userImage = user?.image || undefined

  // Get initials from name
  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      }
      return user.name.substring(0, 2).toUpperCase()
    }
    return "US"
  }

  // TODO: Get plan info from your subscription system
  const plan = {
    name: "Gratuito",
    isPaid: false,
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Você saiu com sucesso")
            router.refresh()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Erro ao sair")
          },
        },
      })
    } catch (error) {
      toast.error("Erro ao sair")
    }
  }

  if (isPending) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", className)}
        disabled
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            ...
          </AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", className)}
          />
        }
      >
        <Avatar size="sm">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">Menu do usuário</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{userName}</p>
              <Badge
                variant={plan.isPaid ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0"
              >
                {plan.name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Upgrade Plan - Only show for free users */}
        {!plan.isPaid && (
          <>
            <DropdownMenuItem
              render={
                <Link href="/settings?tab=plan" className="cursor-pointer" />
              }
            >
              <SparklesIcon className="mr-2 size-4 text-primary" />
              <span>Fazer Upgrade</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Profile & Settings */}
        <DropdownMenuItem
          render={
            <Link href="/settings?tab=account" className="cursor-pointer" />
          }
        >
          <UserIcon className="mr-2 size-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <Link href="/settings" className="cursor-pointer" />
          }
        >
          <SettingsIcon className="mr-2 size-4" />
          <span>Configurações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOutIcon className="mr-2 size-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
