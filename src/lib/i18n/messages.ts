export const supportedLocales = ["ja", "en"] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "ja";
export const localeCookieName = "app_locale";

export const messages = {
  ja: {
    common: {
      loading: "読み込み中",
      close: "閉じる",
    },
    header: {
      brandTitle: "GPT-Image 1.5 Playground",
      brandSubtitle: "Azure AI Foundry Image Edit",
      nav: {
        home: "ホーム",
        playground: "プレイグラウンド",
        about: "使い方",
        settings: "設定",
        login: "ログイン",
      },
      language: {
        label: "言語",
        options: {
          ja: "日本語",
          en: "English",
        },
      },
    },
    footer: {
      text: "Azure AI Foundry GPT-Image-1.5 Playground",
    },
    home: {
      hero: {
        label: "Azure AI Foundry",
        title: "GPT-Image-1.5 画像編集プレイグラウンド",
        description:
          "参照画像をアップロードし、プロンプトと各種オプションを調整して画像編集を実行できます。プロンプトテンプレートもサーバ上のテキストファイルとして管理します。",
        ctaStart: "画像編集を開始",
        ctaGuide: "使い方を見る",
      },
      cards: {
        editOptions: {
          title: "完全な編集オプション",
          body: "サイズ、品質、入力忠実度、背景、出力形式など全オプションをフォームから指定可能。",
        },
        templates: {
          title: "テンプレート管理",
          body: "prompt-templates ディレクトリの .txt を自動読み込みして即時利用。",
        },
        auth: {
          title: "Azure 認証",
          body: "DefaultAzureCredential を利用し、ローカルは Azure CLI、ACA では Managed Identity を想定。",
        },
      },
    },
    about: {
      title: "使い方",
      description:
        "GPT-Image-1.5 の画像編集 API を利用して、参照画像を編集します。",
      steps: {
        step1: "Playground ページで参照画像（PNG/JPG）をアップロードします。",
        step2: "自由形式のプロンプトを入力します（テンプレートも利用できます）。",
        step3: "編集オプションを必要に応じて調整します。",
        step4: "実行すると、編集された画像がプレビューされます。",
      },
    },
    items: {
      title: "画像編集プレイグラウンド",
      description:
        "参照画像とマスクをアップロードし、GPT-Image-1.5 の全オプションを指定して編集します。",
      form: {
        image: "参照画像 (PNG/JPG)",
        mask: "マスク画像 (任意, PNG)",
        prompt: "プロンプト",
        promptPlaceholder:
          "例: 参照画像の背景を夕焼けの海に変更して、中央にビーチボールを追加する",
        templateLabel: "テンプレート",
        templatePlaceholder: "選択してください",
        templateLoading: "読み込み中",
        templateLoad: "読み込み",
        optionsTitle: "画像編集オプション",
        model: "モデル",
        size: "サイズ",
        quality: "品質",
        numberOfImages: "生成枚数 (1-10)",
        inputFidelity: "入力忠実度",
        outputFormat: "出力形式",
        outputCompression: "出力圧縮 (0-100)",
        background: "背景 (例: transparent)",
        userId: "ユーザー ID",
        submit: "画像編集を実行",
        submitLoading: "実行中...",
      },
      results: {
        title: "生成結果",
        previous: "過去の生成結果",
        empty: "まだ結果がありません。",
        expandLabel: "編集結果 {index} を拡大表示",
        expandedAlt: "拡大表示",
      },
      errors: {
        fetchTemplates: "テンプレート一覧の取得に失敗しました。",
        fetchTemplate: "テンプレートの読み込みに失敗しました。",
        noImage: "参照画像を選択してください。",
        requestFailed: "画像編集に失敗しました。",
        generic: "エラーが発生しました。",
      },
    },
    login: {
      title: "ログイン",
      description:
        "環境変数で設定したユーザー名とパスワードを入力してください。",
      username: "ユーザー名",
      password: "パスワード",
      submit: "ログイン",
      submitLoading: "ログイン中...",
      error: "ログインに失敗しました。",
    },
    settings: {
      title: "設定",
      description:
        "環境変数で Azure OpenAI の接続情報を設定します。UI では設定変更は行いません。",
      sectionTitle: "主な環境変数",
      optional: "任意",
    },
  },
  en: {
    common: {
      loading: "Loading",
      close: "Close",
    },
    header: {
      brandTitle: "GPT-Image 1.5 Playground",
      brandSubtitle: "Azure AI Foundry Image Edit",
      nav: {
        home: "Home",
        playground: "Playground",
        about: "About",
        settings: "Settings",
        login: "Login",
      },
      language: {
        label: "Language",
        options: {
          ja: "日本語",
          en: "English",
        },
      },
    },
    footer: {
      text: "Azure AI Foundry GPT-Image-1.5 Playground",
    },
    home: {
      hero: {
        label: "Azure AI Foundry",
        title: "GPT-Image-1.5 Image Edit Playground",
        description:
          "Upload a reference image, adjust prompts and options, and run image edits. Prompt templates are managed as text files on the server.",
        ctaStart: "Start editing",
        ctaGuide: "View guide",
      },
      cards: {
        editOptions: {
          title: "Complete edit options",
          body: "Configure size, quality, input fidelity, background, output format, and more from the form.",
        },
        templates: {
          title: "Template management",
          body: "Automatically load .txt files from the prompt-templates directory and use them instantly.",
        },
        auth: {
          title: "Azure authentication",
          body: "Uses DefaultAzureCredential: Azure CLI locally and Managed Identity on ACA.",
        },
      },
    },
    about: {
      title: "How to use",
      description:
        "Use the GPT-Image-1.5 image edit API to edit your reference image.",
      steps: {
        step1: "Upload a reference image (PNG/JPG) on the Playground page.",
        step2: "Enter a free-form prompt (templates are also available).",
        step3: "Adjust edit options as needed.",
        step4: "Run the request to preview the edited image.",
      },
    },
    items: {
      title: "Image edit playground",
      description:
        "Upload a reference image and mask, then edit with full GPT-Image-1.5 options.",
      form: {
        image: "Reference image (PNG/JPG)",
        mask: "Mask image (optional, PNG)",
        prompt: "Prompt",
        promptPlaceholder:
          "Example: Change the background to a sunset sea and add a beach ball in the center",
        templateLabel: "Templates",
        templatePlaceholder: "Select a template",
        templateLoading: "Loading",
        templateLoad: "Load",
        optionsTitle: "Image edit options",
        model: "Model",
        size: "Size",
        quality: "Quality",
        numberOfImages: "Number of images (1-10)",
        inputFidelity: "Input fidelity",
        outputFormat: "Output format",
        outputCompression: "Output compression (0-100)",
        background: "Background (e.g. transparent)",
        userId: "User ID",
        submit: "Run image edit",
        submitLoading: "Running...",
      },
      results: {
        title: "Results",
        previous: "Previous results",
        empty: "No results yet.",
        expandLabel: "Enlarge result {index}",
        expandedAlt: "Expanded view",
      },
      errors: {
        fetchTemplates: "Failed to fetch templates.",
        fetchTemplate: "Failed to load the template.",
        noImage: "Please select a reference image.",
        requestFailed: "Image edit failed.",
        generic: "An error occurred.",
      },
    },
    login: {
      title: "Login",
      description:
        "Enter the username and password configured via environment variables.",
      username: "Username",
      password: "Password",
      submit: "Login",
      submitLoading: "Signing in...",
      error: "Login failed.",
    },
    settings: {
      title: "Settings",
      description:
        "Configure Azure OpenAI connection settings via environment variables. UI changes are not supported.",
      sectionTitle: "Key environment variables",
      optional: "Optional",
    },
  },
} as const;

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isSupportedLocale(value) ? value : defaultLocale;
}
