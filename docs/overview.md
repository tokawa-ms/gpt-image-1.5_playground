# 製品概要

日本語 | [English](overview-en.md)

## 目的

GPT-Image-1.5 の画像編集機能を検証・デモできるプレイグラウンドを提供する。参照画像とプロンプトの組み合わせで編集結果を確認し、プロンプトテンプレートを使って再現性の高い実験を行う。

## 想定ユーザー

- 画像編集プロンプトを検証したいプロダクト/デザインチーム
- Azure AI Foundry 上の画像編集 API の動作を確認したい開発者
- 参照画像とマスク画像を使った編集結果を比較したい担当者

## 主要機能

- 参照画像とマスク画像のアップロード
- 画像編集オプションの指定（サイズ、品質、入力忠実度、出力形式、圧縮、背景など）
- 生成結果の一覧表示と拡大ビュー
- テンプレートライブラリの読み込み
- 簡易認証（Cookie ベース）

## 非対象（スコープ外）

- ユーザー管理や権限管理の高度な実装
- 編集履歴の永続化
- ストリーミング出力の UI 表示

## 画面構成

- ホーム（/）: 概要とナビゲーション
- Playground（/items）: 画像編集の入力・結果表示
- About（/about）: 使い方
- Settings（/settings）: 環境変数の案内
- Login（/login）: 簡易認証

## アーキテクチャ概要

- フロントエンド: Next.js App Router + Tailwind CSS
- バックエンド: Next.js API Routes
- 外部サービス: Azure AI Foundry (Azure OpenAI 画像編集 API)
- 認証: 環境変数で設定されたユーザー名/パスワード + Cookie

## データフロー（概要）

1. ユーザーがフォームで入力
2. フロントエンドが /api/image-edit に FormData を送信
3. API が Azure OpenAI 画像編集 API を呼び出し
4. 返却された base64 画像を UI で表示

## 依存関係

- @azure/identity: Azure AD トークン取得
- zod / dotenv: 環境変数の検証
- Next.js / React / Tailwind CSS
