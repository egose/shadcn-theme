'use client';

import { useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import { createHighlighter } from 'shiki';

export function Code({ code }: { code: string }) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    async function run() {
      // 1️⃣ Load Shiki in browser mode
      const highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ['javascript', 'typescript', 'json', 'html', 'css'],
      });

      // 2️⃣ Pass Shiki instance to rehype-pretty-code
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
          highlighter,
          transformers: [
            transformerCopyButton({
              visibility: 'always',
              feedbackDuration: 3_000,
            }),
          ],
        })
        .use(rehypeStringify)
        .process(code);

      setHtml(String(file));
    }

    run();
  }, [code]);

  return (
    <section
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
