export interface Book { id:string; title:string; author:string; totalPages:number|null; currentPage:number; cover:string; createdAt:string }
export interface ReadingEntry {id:string; bookId:string; date:string; startPage:number; endPage:number; originalText:string; summary:string; thoughts:string; lessons:string; createdAt:string; aiStatus:'pending'|'done'|'error'|'sample'; aiError?:string}
export interface Question {id:string; readingEntryId:string; question:string; answer:string; answeredAt:string|null}
export interface Library {version:1; books:Book[]; entries:ReadingEntry[]; questions:Question[]}
export const uid=()=>crypto.randomUUID();
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const chronological=(a:ReadingEntry,b:ReadingEntry)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt);
export function withProgress(data:Library):Library{return {...data,books:data.books.map(b=>({...b,currentPage:data.entries.filter(e=>e.bookId===b.id).sort(chronological).at(-1)?.endPage||0}))}}
