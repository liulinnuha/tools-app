export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    slug: string;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                };
                Relationships: [];
            };
            contact_messages: {
                Row: {
                    created_at: string;
                    email: string;
                    id: string;
                    message: string;
                    name: string;
                    replied: boolean | null;
                    reply_text: string | null;
                    subject: string;
                };
                Insert: {
                    created_at?: string;
                    email: string;
                    id?: string;
                    message: string;
                    name: string;
                    replied?: boolean | null;
                    reply_text?: string | null;
                    subject: string;
                };
                Update: {
                    created_at?: string;
                    email?: string;
                    id?: string;
                    message?: string;
                    name?: string;
                    replied?: boolean | null;
                    reply_text?: string | null;
                    subject?: string;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    created_at: string | null;
                    id: string;
                    is_admin: boolean | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    is_admin?: boolean | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    is_admin?: boolean | null;
                    user_id?: string | null;
                };
                Relationships: [];
            };
            tool_suggestions: {
                Row: {
                    approved: boolean | null;
                    category: string;
                    created_at: string;
                    description: string;
                    email: string;
                    id: string;
                    link: string | null;
                    name: string;
                    reviewed: boolean | null;
                };
                Insert: {
                    approved?: boolean | null;
                    category: string;
                    created_at?: string;
                    description: string;
                    email: string;
                    id?: string;
                    link?: string | null;
                    name: string;
                    reviewed?: boolean | null;
                };
                Update: {
                    approved?: boolean | null;
                    category?: string;
                    created_at?: string;
                    description?: string;
                    email?: string;
                    id?: string;
                    link?: string | null;
                    name?: string;
                    reviewed?: boolean | null;
                };
                Relationships: [];
            };
            tools: {
                Row: {
                    category_id: string | null;
                    created_at: string | null;
                    description: string | null;
                    featured: boolean | null;
                    id: string;
                    image_url: string | null;
                    name: string;
                    slug: string;
                    url: string | null;
                };
                Insert: {
                    category_id?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    featured?: boolean | null;
                    id?: string;
                    image_url?: string | null;
                    name: string;
                    slug: string;
                    url?: string | null;
                };
                Update: {
                    category_id?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    featured?: boolean | null;
                    id?: string;
                    image_url?: string | null;
                    name?: string;
                    slug?: string;
                    url?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tools_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
      ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
      ? PublicSchema["Enums"][PublicEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
      ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never;
