<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // Get all applications for the logged in user
    public function index(Request $request)
    {
        $applications = $request->user()->applications()->latest()->get();
        return response()->json($applications);
    }

    // Create a new application
    public function store(Request $request)
    {
        $request->validate([
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'status' => 'in:applied,interview,offer,rejected',
            'job_description' => 'nullable|string',
            'notes' => 'nullable|string',
            'applied_at' => 'nullable|date',
            'follow_up_date' => 'nullable|date',
        ]);

        $application = $request->user()->applications()->create($request->all());

        return response()->json($application, 201);
    }

    // Update an existing application
    public function update(Request $request, Application $application)
    {
        // Make sure the application belongs to the logged in user
        if ($application->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:applied,interview,offer,rejected',
            'job_description' => 'nullable|string',
            'notes' => 'nullable|string',
            'applied_at' => 'nullable|date',
            'follow_up_date' => 'nullable|date',
        ]);

        $application->update($request->all());

        return response()->json($application);
    }

    // Delete an application
    public function destroy(Request $request, Application $application)
    {
        // Make sure the application belongs to the logged in user
        if ($application->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Application deleted']);
    }
}