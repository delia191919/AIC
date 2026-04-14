from fastapi import FastAPI, File, UploadFile
from PIL import Image
from sentence_transformers import SentenceTransformer, util
import io

app = FastAPI()

print("Loading CLIP model...")
model = SentenceTransformer('clip-ViT-B-32')
print("Model loaded.")

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    labels = [
        "mountain", "snow", "avalanche", "forest", "skiing", "hiking", 
        "sand", "beach", "desert", "person", "car", "room", "cat", "city", 
        "food", "furniture", "indoor", "technology", "face", "ocean"
    ]
    
    image_emb = model.encode(image)
    text_emb = model.encode(labels)
    
    cos_scores = util.cos_sim(image_emb, text_emb)[0]
    
    results = []
    for label, score in zip(labels, cos_scores):
        results.append({"label": label, "score": float(score)})
    
    results.sort(key=lambda x: x["score"], reverse=True)
    
    print(f"Classification result: {results[:5]}")
    
    relevant_labels = ["mountain", "snow", "avalanche", "forest", "skiing", "hiking"]
    top_label = results[0]["label"]
    is_valid = top_label in relevant_labels
    
    return {
        "valid": bool(is_valid),
        "top_label": top_label,
        "confidence": results[0]["score"],
        "summary": results[:3]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
