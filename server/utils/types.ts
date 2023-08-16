export interface Role {
    type : string;
    users? : User[];
    permissions? : Permission;
    permissionsId : number; 
}

export interface Permission {
    id : number;
    canUpdatePost :  boolean;
    canDisableUser :  boolean;
    canEnableUser :  boolean;
    canDeletePost :  boolean;
    canDeleteAnyPost :  boolean;
    canReadPosts :  boolean;
    canUploadImages :  boolean;
    canCreatePost :  boolean;
    Role? : string;
}

export interface User {
    email : string;
    password : string;
    isActive : boolean;
    createdAt? : Date | null;
    role? : Role; 
    roleType? : string | null;
    posts? : Post[];
}

export interface Post { 
    id : number;
    title : string;
    isDeleted : boolean;
    description :  string;
    imageSrc : string;
    user? : User;
    user_id? : number;
    createdAt? : Date;
    updatedAt? : Date;
    deletedAt? : Date;
    deletedBy? : string;
}