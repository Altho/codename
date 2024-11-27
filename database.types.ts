export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Attributes: {
        Row: {
          Created_at: string
          Enabled: boolean | null
          id: number
          Name: string
          Updated_at: string
        }
        Insert: {
          Created_at?: string
          Enabled?: boolean | null
          id?: number
          Name: string
          Updated_at?: string
        }
        Update: {
          Created_at?: string
          Enabled?: boolean | null
          id?: number
          Name?: string
          Updated_at?: string
        }
        Relationships: []
      }
      CharacterModifiers: {
        Row: {
          Effect: string | null
          Example: string | null
          id: number
          IsDetriment: boolean | null
          Name: string
          Scales: number | null
        }
        Insert: {
          Effect?: string | null
          Example?: string | null
          id?: number
          IsDetriment?: boolean | null
          Name: string
          Scales?: number | null
        }
        Update: {
          Effect?: string | null
          Example?: string | null
          id?: number
          IsDetriment?: boolean | null
          Name?: string
          Scales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "CharacterBonuses_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
        ]
      }
      Characters: {
        Row: {
          Created_at: string
          id: number
          Name: string
          ProfileId: string | null
          Updated_at: string | null
        }
        Insert: {
          Created_at?: string
          id?: number
          Name?: string
          ProfileId?: string | null
          Updated_at?: string | null
        }
        Update: {
          Created_at?: string
          id?: number
          Name?: string
          ProfileId?: string | null
          Updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_profileId_fkey"
            columns: ["ProfileId"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Classes: {
        Row: {
          Description: string | null
          id: number
          Info: string | null
          Name: string
          Picture: string | null
        }
        Insert: {
          Description?: string | null
          id?: number
          Info?: string | null
          Name: string
          Picture?: string | null
        }
        Update: {
          Description?: string | null
          id?: number
          Info?: string | null
          Name?: string
          Picture?: string | null
        }
        Relationships: []
      }
      ClassesEffect: {
        Row: {
          ClassId: number
          EffectId: number | null
          id: number
        }
        Insert: {
          ClassId: number
          EffectId?: number | null
          id?: number
        }
        Update: {
          ClassId?: number
          EffectId?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ClassesEffect_ClassId_fkey"
            columns: ["ClassId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassesEffect_EffectId_fkey1"
            columns: ["EffectId"]
            isOneToOne: false
            referencedRelation: "CriticalEffects"
            referencedColumns: ["id"]
          },
        ]
      }
      CoreSkillsCategories: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      CriticalEffects: {
        Row: {
          BonusFor: number | null
          DcEffect: string | null
          id: number
          Name: string
          Scales: number | null
          TriggeredOn: number | null
        }
        Insert: {
          BonusFor?: number | null
          DcEffect?: string | null
          id?: number
          Name: string
          Scales?: number | null
          TriggeredOn?: number | null
        }
        Update: {
          BonusFor?: number | null
          DcEffect?: string | null
          id?: number
          Name?: string
          Scales?: number | null
          TriggeredOn?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "CriticalEffects_BonusFor_fkey"
            columns: ["BonusFor"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CriticalEffects_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
        ]
      }
      DamageTypes: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      EffectTypes: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      NpcUse: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      Oppositions: {
        Row: {
          DamageId: number | null
          EffectId: number | null
          id: number
          isDamage: boolean | null
          isEffect: boolean | null
          IsModifier: boolean | null
          IsNpcOnly: boolean | null
          isSkill: boolean
          ModifierId: number | null
          SkillId: number | null
          TargetSkillId: number | null
        }
        Insert: {
          DamageId?: number | null
          EffectId?: number | null
          id?: number
          isDamage?: boolean | null
          isEffect?: boolean | null
          IsModifier?: boolean | null
          IsNpcOnly?: boolean | null
          isSkill: boolean
          ModifierId?: number | null
          SkillId?: number | null
          TargetSkillId?: number | null
        }
        Update: {
          DamageId?: number | null
          EffectId?: number | null
          id?: number
          isDamage?: boolean | null
          isEffect?: boolean | null
          IsModifier?: boolean | null
          IsNpcOnly?: boolean | null
          isSkill?: boolean
          ModifierId?: number | null
          SkillId?: number | null
          TargetSkillId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Oppositions_DamageId_fkey"
            columns: ["DamageId"]
            isOneToOne: false
            referencedRelation: "DamageTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Oppositions_EffectId_fkey"
            columns: ["EffectId"]
            isOneToOne: false
            referencedRelation: "EffectTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Oppositions_ModifierId_fkey"
            columns: ["ModifierId"]
            isOneToOne: false
            referencedRelation: "CharacterModifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Oppositions_SkillId_fkey"
            columns: ["SkillId"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Oppositions_TargetSkillIt_fkey"
            columns: ["TargetSkillId"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
        ]
      }
      Profiles: {
        Row: {
          AvatarUrl: string | null
          FullName: string | null
          id: string
          isAdmin: boolean | null
          UpdatedAt: string | null
          Username: string | null
          Website: string | null
        }
        Insert: {
          AvatarUrl?: string | null
          FullName?: string | null
          id: string
          isAdmin?: boolean | null
          UpdatedAt?: string | null
          Username?: string | null
          Website?: string | null
        }
        Update: {
          AvatarUrl?: string | null
          FullName?: string | null
          id?: string
          isAdmin?: boolean | null
          UpdatedAt?: string | null
          Username?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      Resources: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      Scales: {
        Row: {
          id: number
          Name: string
        }
        Insert: {
          id?: number
          Name: string
        }
        Update: {
          id?: number
          Name?: string
        }
        Relationships: []
      }
      SituationalBonuses: {
        Row: {
          BonusFor: number | null
          id: number
          Name: string
          Notes: string | null
          Scales: number | null
          Situation: string | null
          UsedBy: number | null
        }
        Insert: {
          BonusFor?: number | null
          id?: number
          Name: string
          Notes?: string | null
          Scales?: number | null
          Situation?: string | null
          UsedBy?: number | null
        }
        Update: {
          BonusFor?: number | null
          id?: number
          Name?: string
          Notes?: string | null
          Scales?: number | null
          Situation?: string | null
          UsedBy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "SituationalBonuses_BonusFor_fkey"
            columns: ["BonusFor"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SituationalBonuses_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SituationalBonuses_UsedBy_fkey"
            columns: ["UsedBy"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
        ]
      }
      Skills: {
        Row: {
          Category: number | null
          CreatedAt: string
          DcEffect: string
          Enabled: boolean | null
          id: number
          Name: string
          NpcUse: string | null
          UpdatedAt: string
        }
        Insert: {
          Category?: number | null
          CreatedAt?: string
          DcEffect: string
          Enabled?: boolean | null
          id?: number
          Name: string
          NpcUse?: string | null
          UpdatedAt?: string
        }
        Update: {
          Category?: number | null
          CreatedAt?: string
          DcEffect?: string
          Enabled?: boolean | null
          id?: number
          Name?: string
          NpcUse?: string | null
          UpdatedAt?: string
        }
        Relationships: []
      }
      SPC: {
        Row: {
          Benefits: string | null
          BonusFor: number | null
          id: number
          Name: string
          Scales: number | null
          Spends: number | null
          SpendsOn: number | null
          UsedBy: number | null
        }
        Insert: {
          Benefits?: string | null
          BonusFor?: number | null
          id?: number
          Name: string
          Scales?: number | null
          Spends?: number | null
          SpendsOn?: number | null
          UsedBy?: number | null
        }
        Update: {
          Benefits?: string | null
          BonusFor?: number | null
          id?: number
          Name?: string
          Scales?: number | null
          Spends?: number | null
          SpendsOn?: number | null
          UsedBy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "SPC_BonusFor_fkey"
            columns: ["BonusFor"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPC_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPC_SpendsOn_fkey"
            columns: ["SpendsOn"]
            isOneToOne: false
            referencedRelation: "Resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SPC_UsedBy_fkey"
            columns: ["UsedBy"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
        ]
      }
      Synergies: {
        Row: {
          ClassId: number | null
          id: number
          SkillId: number
        }
        Insert: {
          ClassId?: number | null
          id?: number
          SkillId: number
        }
        Update: {
          ClassId?: number | null
          id?: number
          SkillId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Synergies_ClassId_fkey"
            columns: ["ClassId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Synergies_SkillId_fkey"
            columns: ["SkillId"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
        ]
      }
      TRC: {
        Row: {
          BonusFor: number | null
          ConversionBonuses: string | null
          id: number
          Name: string
          Scales: number | null
          Spends: number | null
          SpendsOn: number | null
          UsedBy: number | null
        }
        Insert: {
          BonusFor?: number | null
          ConversionBonuses?: string | null
          id?: number
          Name: string
          Scales?: number | null
          Spends?: number | null
          SpendsOn?: number | null
          UsedBy?: number | null
        }
        Update: {
          BonusFor?: number | null
          ConversionBonuses?: string | null
          id?: number
          Name?: string
          Scales?: number | null
          Spends?: number | null
          SpendsOn?: number | null
          UsedBy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "TRC_BonusFor_fkey"
            columns: ["BonusFor"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TRC_Resources_fkey"
            columns: ["SpendsOn"]
            isOneToOne: false
            referencedRelation: "Resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TRC_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TRC_UsedBy_fkey"
            columns: ["UsedBy"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
        ]
      }
      UniqueBonuses: {
        Row: {
          AllowsNewAbility: string | null
          id: number
          Name: string | null
          Note: string | null
          RollWith: number | null
          Scales: number | null
          UsedBy: number | null
        }
        Insert: {
          AllowsNewAbility?: string | null
          id?: number
          Name?: string | null
          Note?: string | null
          RollWith?: number | null
          Scales?: number | null
          UsedBy?: number | null
        }
        Update: {
          AllowsNewAbility?: string | null
          id?: number
          Name?: string | null
          Note?: string | null
          RollWith?: number | null
          Scales?: number | null
          UsedBy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "UniqueBonuses_RollWith_fkey"
            columns: ["RollWith"]
            isOneToOne: false
            referencedRelation: "Skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UniqueBonuses_Scales_fkey"
            columns: ["Scales"]
            isOneToOne: false
            referencedRelation: "Scales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UniqueBonuses_UsedBy_fkey"
            columns: ["UsedBy"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
