export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Spendora API",
    version: "1.0.0",
    description: "API documentation for Spendora - Personal Finance and Expense Tracking Application",
    contact: {
      name: "Spendora Support"
    }
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local Development Server"
    }
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication and authorization endpoints"
    },
    {
      name: "Categories",
      description: "Transaction category management (Income & Expense)"
    },
    {
      name: "Transactions",
      description: "Income and expense transactions tracking"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Bearer token in the format: Bearer <token>"
      }
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true
          },
          message: {
            type: "string",
            example: "Operation successful"
          },
          data: {
            type: "object"
          }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false
          },
          message: {
            type: "string",
            example: "Error message description"
          },
          error: {
            type: "string",
            example: "Detailed error info if available"
          }
        }
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "123e4567-e89b-12d3-a456-426614174000"
          },
          name: {
            type: "string",
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com"
          },
          role: {
            type: "string",
            enum: ["USER", "ADMIN"],
            example: "USER"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T10:00:00.000Z"
          }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 40,
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com"
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "StrongPassword123"
          }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com"
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "StrongPassword123"
          }
        }
      },
      RefreshTokenRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          name: {
            type: "string",
            example: "groceries"
          },
          type: {
            type: "string",
            enum: ["INCOME", "EXPENSE"],
            example: "EXPENSE"
          },
          isGlobal: {
            type: "boolean",
            example: false
          }
        }
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            example: "groceries"
          },
          type: {
            type: "string",
            enum: ["INCOME", "EXPENSE"],
            example: "EXPENSE"
          }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            example: 1
          },
          limit: {
            type: "integer",
            example: 10
          },
          totalRecords: {
            type: "integer",
            example: 25
          },
          totalPages: {
            type: "integer",
            example: 3
          }
        }
      },
      Transaction: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          title: {
            type: "string",
            nullable: true,
            example: "Supermarket run"
          },
          amount: {
            type: "number",
            format: "float",
            example: 75.50
          },
          type: {
            type: "string",
            enum: ["INCOME", "EXPENSE"],
            example: "EXPENSE"
          },
          notes: {
            type: "string",
            nullable: true,
            example: "Weekly groceries and household essentials"
          },
          transactionDate: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T12:00:00.000Z"
          },
          userId: {
            type: "string",
            format: "uuid",
            example: "123e4567-e89b-12d3-a456-426614174000"
          },
          categoryId: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          category: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
                example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
              },
              name: {
                type: "string",
                example: "groceries"
              },
              type: {
                type: "string",
                enum: ["INCOME", "EXPENSE"],
                example: "EXPENSE"
              }
            }
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T12:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T12:00:00.000Z"
          }
        }
      },
      CreateTransactionRequest: {
        type: "object",
        required: ["categoryId", "amount", "type"],
        properties: {
          categoryId: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          amount: {
            type: "number",
            format: "float",
            minimum: 0.01,
            example: 75.50
          },
          type: {
            type: "string",
            enum: ["INCOME", "EXPENSE"],
            example: "EXPENSE"
          },
          title: {
            type: "string",
            maxLength: 100,
            example: "Supermarket run"
          },
          notes: {
            type: "string",
            maxLength: 255,
            example: "Weekly groceries"
          },
          transactionDate: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T12:00:00.000Z"
          }
        }
      },
      UpdateTransactionRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          categoryId: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          amount: {
            type: "number",
            format: "float",
            minimum: 0.01,
            example: 85.00
          },
          type: {
            type: "string",
            enum: ["INCOME", "EXPENSE"],
            example: "EXPENSE"
          },
          title: {
            type: "string",
            maxLength: 100,
            example: "Updated supermarket run"
          },
          notes: {
            type: "string",
            maxLength: 255,
            example: "Added extra household supplies"
          },
          transactionDate: {
            type: "string",
            format: "date-time",
            example: "2026-09-02T12:00:00.000Z"
          }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Registers a new user account with name, email, and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User registered successfully" },
                    data: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Validation error or user already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in user",
        description: "Authenticates user with email and password, returning JWT access and refresh tokens.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "User logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User logged in successfully" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
                        refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out user",
        description: "Invalidates the refresh token for the authenticated user.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User logged out successfully" },
                    data: {
                      type: "object",
                      properties: {
                        message: { type: "string", example: "Logged out successfully" }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Unauthorized - missing or invalid access token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Generates a new access token using a valid refresh token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshTokenRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Access token refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Access token refreshed successfully" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Unauthorized - invalid or expired refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset",
        description: "Endpoint to request a password reset email.",
        responses: {
          "200": {
            description: "Password reset request initiated"
          }
        }
      }
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description: "Endpoint to reset user password.",
        responses: {
          "200": {
            description: "Password reset completed"
          }
        }
      }
    },
    "/api/categories": {
      post: {
        tags: ["Categories"],
        summary: "Create a new category",
        description: "Creates a user-defined category for INCOME or EXPENSE.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCategoryRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Category created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Category created successfully" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                        category_name: { type: "string", example: "groceries" },
                        type: { type: "string", enum: ["INCOME", "EXPENSE"], example: "EXPENSE" },
                        is_global: { type: "boolean", example: false }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Validation error or category already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      get: {
        tags: ["Categories"],
        summary: "Get all accessible categories",
        description: "Retrieves paginated categories (global and user-created) with optional type filter.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            description: "Filter by category type",
            required: false,
            schema: {
              type: "string",
              enum: ["INCOME", "EXPENSE"]
            }
          },
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: false,
            schema: {
              type: "integer",
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            description: "Number of records per page",
            required: false,
            schema: {
              type: "integer",
              default: 10
            }
          }
        ],
        responses: {
          "200": {
            description: "Categories fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Categories fetched successfully" },
                    data: {
                      type: "object",
                      properties: {
                        categories: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Category" }
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category by ID",
        description: "Fetches single category created by authenticated user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Category UUID",
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Category fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Category fetched successfully" },
                    data: { $ref: "#/components/schemas/Category" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Category not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Categories"],
        summary: "Soft delete category by ID",
        description: "Soft deletes a category created by the user (sets isDisabled to true).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Category UUID",
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Category deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "category deleted successfully" },
                    data: { $ref: "#/components/schemas/Category" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Category not found or unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/transactions": {
      post: {
        tags: ["Transactions"],
        summary: "Create a new transaction",
        description: "Creates an income or expense transaction linked to a valid category.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTransactionRequest"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Transaction created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Transaction created successfully" },
                    data: { $ref: "#/components/schemas/Transaction" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Validation error or invalid category",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      get: {
        tags: ["Transactions"],
        summary: "Get all transactions",
        description: "Retrieves paginated transactions with optional filters for type and date range.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            description: "Filter by transaction type",
            required: false,
            schema: {
              type: "string",
              enum: ["INCOME", "EXPENSE"]
            }
          },
          {
            name: "from",
            in: "query",
            description: "Start date (YYYY-MM-DD)",
            required: false,
            schema: {
              type: "string",
              format: "date",
              example: "2026-09-01"
            }
          },
          {
            name: "to",
            in: "query",
            description: "End date (YYYY-MM-DD)",
            required: false,
            schema: {
              type: "string",
              format: "date",
              example: "2026-09-30"
            }
          },
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: false,
            schema: {
              type: "integer",
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            description: "Records per page",
            required: false,
            schema: {
              type: "integer",
              default: 10
            }
          }
        ],
        responses: {
          "200": {
            description: "Transactions fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Transactions fetched successfully" },
                    data: {
                      type: "object",
                      properties: {
                        transactions: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Transaction" }
                        },
                        totalRecords: { type: "integer", example: 45 },
                        totalPages: { type: "integer", example: 5 },
                        currentPage: { type: "integer", example: 1 }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/transactions/{id}": {
      patch: {
        tags: ["Transactions"],
        summary: "Update transaction by ID",
        description: "Updates one or more fields of an existing transaction.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Transaction UUID",
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTransactionRequest"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Transaction updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Transaction updated successfully" },
                    data: { $ref: "#/components/schemas/Transaction" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Transaction not found or invalid data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Transactions"],
        summary: "Delete transaction by ID",
        description: "Permanently removes a transaction belonging to the authenticated user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Transaction UUID",
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Transaction deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Transaction deleted successfully" },
                    data: { $ref: "#/components/schemas/Transaction" }
                  }
                }
              }
            }
          },
          "404": {
            description: "Transaction not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerDocument;
