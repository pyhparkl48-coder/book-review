import {Book,Library,ReadingEntry,chronological} from './types';
export async function coach(book:Book,entry:ReadingEntry,data:Library,mode:'organize'|'questions'){
 const previous=data.entries.filter(e=>e.bookId===book.id&&chronological(e,entry)<0).sort(chronological).slice(-12).map(e=>({date:e.date,originalText:e.originalText,thoughts:e.thoughts,questions:data.questions.filter(q=>q.readingEntryId===e.id).map(q=>({question:q.question,answer:q.answer}))}));
 const res=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({book:{title:book.title,author:book.author},entry,previous,existingQuestions:data.questions.filter(q=>q.readingEntryId===entry.id).map(q=>q.question),mode}),signal:AbortSignal.timeout(65000)});
 const body=await res.json() as {error?:string;summary:string;thoughts:string;lessons:string;questions:string[]};if(!res.ok)throw Error(body.error||'AI 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');return body as {summary:string;thoughts:string;lessons:string;questions:string[]};
}

