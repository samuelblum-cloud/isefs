export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cms_admin_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          active: boolean
          created_at: string
          email: string
          email_normalised: string | null
          id: string
          role: Database["public"]["Enums"]["cms_admin_role"]
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          active?: boolean
          created_at?: string
          email: string
          email_normalised?: string | null
          id?: string
          role?: Database["public"]["Enums"]["cms_admin_role"]
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          active?: boolean
          created_at?: string
          email?: string
          email_normalised?: string | null
          id?: string
          role?: Database["public"]["Enums"]["cms_admin_role"]
        }
        Relationships: []
      }
      cms_admin_users: {
        Row: {
          active: boolean
          created_at: string
          role: Database["public"]["Enums"]["cms_admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          role?: Database["public"]["Enums"]["cms_admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          role?: Database["public"]["Enums"]["cms_admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cms_content_blocks: {
        Row: {
          block_type: string
          created_at: string
          data: Json
          id: string
          internal_name: string
          page_version_id: string
          position: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          block_type: string
          created_at?: string
          data?: Json
          id?: string
          internal_name: string
          page_version_id: string
          position?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          block_type?: string
          created_at?: string
          data?: Json
          id?: string
          internal_name?: string
          page_version_id?: string
          position?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_blocks_page_version_id_fkey"
            columns: ["page_version_id"]
            isOneToOne: false
            referencedRelation: "cms_page_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media_assets: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          file_name: string
          focal_x: number
          focal_y: number
          id: string
          is_public: boolean
          mime_type: string
          public_url: string
          rights_holder: string
          rights_note: string
          storage_path: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string
          caption?: string
          created_at?: string
          file_name: string
          focal_x?: number
          focal_y?: number
          id?: string
          is_public?: boolean
          mime_type: string
          public_url: string
          rights_holder?: string
          rights_note?: string
          storage_path: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          file_name?: string
          focal_x?: number
          focal_y?: number
          id?: string
          is_public?: boolean
          mime_type?: string
          public_url?: string
          rights_holder?: string
          rights_note?: string
          storage_path?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      cms_page_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          meta_description: string
          meta_title: string
          page_id: string
          page_title: string
          published_at: string | null
          status: Database["public"]["Enums"]["cms_version_status"]
          updated_at: string
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string
          meta_title?: string
          page_id: string
          page_title: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["cms_version_status"]
          updated_at?: string
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string
          meta_title?: string
          page_id?: string
          page_title?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["cms_version_status"]
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "cms_page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          internal_name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          internal_name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          internal_name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          internal_notes: string
          message: string
          name: string
          subject: string
          updated_at: string
          workflow_status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          internal_notes?: string
          message: string
          name: string
          subject: string
          updated_at?: string
          workflow_status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          internal_notes?: string
          message?: string
          name?: string
          subject?: string
          updated_at?: string
          workflow_status?: string
        }
        Relationships: []
      }
      interest_registrations: {
        Row: {
          areas_of_interest: string[]
          country: string
          created_at: string
          email: string
          email_normalised: string | null
          first_name: string
          id: string
          institution: string | null
          internal_notes: string
          last_name: string
          newsletter_consent: boolean
          privacy_accepted_at: string | null
          source: string
          specialty: string
          updated_at: string
          workflow_status: string
        }
        Insert: {
          areas_of_interest?: string[]
          country: string
          created_at?: string
          email: string
          email_normalised?: string | null
          first_name: string
          id?: string
          institution?: string | null
          internal_notes?: string
          last_name: string
          newsletter_consent?: boolean
          privacy_accepted_at?: string | null
          source?: string
          specialty: string
          updated_at?: string
          workflow_status?: string
        }
        Update: {
          areas_of_interest?: string[]
          country?: string
          created_at?: string
          email?: string
          email_normalised?: string | null
          first_name?: string
          id?: string
          institution?: string | null
          internal_notes?: string
          last_name?: string
          newsletter_consent?: boolean
          privacy_accepted_at?: string | null
          source?: string
          specialty?: string
          updated_at?: string
          workflow_status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cms_is_admin: { Args: never; Returns: boolean }
      create_cms_page: {
        Args: {
          input_internal_name: string
          input_page_title: string
          input_slug: string
        }
        Returns: string
      }
      publish_cms_page: { Args: { target_page_id: string }; Returns: string }
      restore_cms_page_version: {
        Args: { source_version_id: string; target_page_id: string }
        Returns: string
      }
      save_cms_draft: {
        Args: {
          input_blocks: Json
          input_meta_description: string
          input_meta_title: string
          input_page_title: string
          target_version_id: string
        }
        Returns: string
      }
      set_cms_admin_invitation: {
        Args: {
          input_email: string
          input_role: Database["public"]["Enums"]["cms_admin_role"]
        }
        Returns: string
      }
    }
    Enums: {
      cms_admin_role: "owner" | "editor"
      cms_version_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cms_admin_role: ["owner", "editor"],
      cms_version_status: ["draft", "published", "archived"],
    },
  },
} as const
