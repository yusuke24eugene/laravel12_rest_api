<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()
            ->when(request('search'), function ($query) {
                $query->where('name', 'like', '%' . request('search') . '%')
                      ->orWhere('description', 'like', '%' . request('search') . '%');
            })
            ->when(request('min_price'), function ($query) {
                $query->where('price', '>=', request('min_price'));
            })
            ->when(request('max_price'), function ($query) {
                $query->where('price', '<=', request('max_price'));
            })
            ->orderBy(request('sort_by', 'id'), request('sort_dir', 'asc'))
            ->paginate(request('per_page', 15));

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'barcode' => 'nullable|string|max:13|unique:products,barcode',
        ]);

        $product = Product::create($validated);

        return response()->json($product, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'barcode' => 'nullable|string|max:13|unique:products,barcode,' . $product->id,
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
