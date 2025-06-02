from langgraph.graph import StateGraph, END
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from app.services.vector_store import get_vector_retriever
from langchain.prompts import PromptTemplate

class GraphState(dict): pass

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

def retrieve_answer(state: GraphState) -> GraphState:
    print(f"[DEBUG] Full state received: {state}")
    question = state.get("question")
    if not question:
        raise ValueError("Missing 'question' in state.")
    
    retriever = get_vector_retriever()

    custom_prompt = PromptTemplate.from_template("""
        You are a helpful assistant. You must only answer questions using the information provided in the context below.

        If the answer cannot be found in the context, respond clearly and politely with:
        "I'm sorry, but I couldn't find the answer to that question based on the information provided."

        Do not use any external knowledge or make assumptions. Only respond based on the context.

        Context:
        {context}

        Question:
        {question}

        Answer:
        """
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": custom_prompt}
    )

    result = qa_chain.invoke({"query": question})
    return {"question": question, "answer": result}

def build_bot_graph():
    builder = StateGraph(dict)
    builder.add_node("retrieve", retrieve_answer)
    builder.set_entry_point("retrieve")
    builder.set_finish_point("retrieve")
    return builder.compile()
