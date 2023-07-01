---
banner: pup-test.png
categories:
  - Testing
  - Integration Testing
date: 2023-07-01 00:11:27
excerpt: Theorizing and writing integration tests from the ground-up for ASP.NET Core.
tags:
  - Testing
  - xUnit
  - AutoFixture
  - Removing Boilerplate
title: Integration Testing in ASP.NET Core With Simplicity and Elegance
---
# Preamble
This short writeup is meant to foster a mutual definition of integration tests, their purpose, and some of their setup. It will briefly cover everything from the conceptual reasoning behind integration tests, to their execution and structure within ASP.NET Core.

{% asset_img pup-test.png %}

# Concepts

## Testing Taxonomies
Given that there are varied interpretations of labels when it comes to testing, it's more effectual to discuss test methodologies by defining their conceptual taxonomies - in other words, into what component parts can we break down a test methodology. [This article](https://blog.7mind.io/constructive-test-taxonomy.html) does an excellent job, and gives us three axes to categorize tests: **Intention**, **Encapsulation**, **Isolation**.

- **Intention**: The intent of our tests, whether they're testing contracts/behaviors, regressions, or benchmarks
- **Encapsulation**: The extent to which the test is aware of the unit being tested. White box (knows all), black box (knows nothing), effectual (strictly observe side effects)
- **Isolation**: How much of a single system, or how many systems, are involved in a test. Atomic (method), group (classes/internal), commnuication (external)
  - The above article defines two kinds of external communication: "good" and "bad". Bad communication is to an uncontrolled service (like a Facebook API), whereas good communication is to a controlled service (an ephemeral database)

### Test Isolation Breakdown
As the isolation level changes, two things change: the scope of live code being tested, and the units we may substitute.

- **High Isolation**
  - Test: Individual methods
  - Purpose: Verify the logic of the public surface area of classes
  - Mock: Calls to other classes
  - Do not Mock: Internals of methods
    - This could be akin to changing which lines of code get compiled when testing.
- **Medium Isolation**
  - Test: Whole classes in the application
  - Purpose: Observe the interaction between classes in an application
  - Mock: Usages of external (out-of-application) services
  - Do not change: Internals of classes
- **Low Isolation**
  - Test: Whole applications 
  - Purpose: Observe two or more applications interacting with each other
  - Mock: "Bad communication" to services (see above definition)
  - Do not change: Internals of applications
- **No Isolation**
  - Test: Whole (perhaps deployed) systems
  - Purpose: Observe the behavior of a system
  - Mock: Nothing
  - Do not change: Internals of the system

### When to NOT Mock
The above summation outlines levels to abstain using mocks: at the same isolation level (or lower) than the current test. Unit tests don't fake lines of code, integration tests don't fake internal services or classes, and system tests (those capable of targeting a deployed envrionment) wouldn't mock any part of the system. The general guideline is: once you've set your isolation level, be true to it and test all of its code. Utilizing test doubles at the same (or lower) level of your isolation means you are testing an _entirely different [method|integration|application]_, and it holds much less value.

### Stubs, Fakes, Mocks, and Exceptions
Guidelines have reasonable deviations, and the above is no exception. For a definition of these three test doubles, [see these examples](https://www.educative.io/answers/what-is-faking-vs-mocking-vs-stubbing).

One exception to the above is _stubbing out_ services, rather than so-called "bad communication" tests. Good software architecture will isolate and minimize the code surrounding usage of a 3'rd party service that is outside of your control. This is done so that all of its usage is hidden behind a simple interface that can be stubbed or mocked out (or, outside of testing, replaced with another similar service down the line!).

Another exception might be including fakes in unit and integration tests when it doesn't meaningfully compromise the code under test. Replacing a distributed cache with a built-in in-memory cache when unit testing is an example where the functionality is effectively the same, but it becomes a controlled, in-process communication that alleviates _needing_ to mock the cache in each test, saving developers time and cutting down on on code. Some smaller integration tests may also prefer to exercise one external system at a time, or not at all - such as logging to a 3'rd party log/analytics provider during.
  
## Defining an "Integration Test"
With the above axes in mind, we can create a definition for this article on what an integration test means.

- **Intention**: Contracts
  - These tests verify behavior of the specified contracts in the application. A contract can be analogous the acceptance criteria of a given user story
- **Encapsulation**: Black Box, occasionally Effectual
  - Usually our tests follow a pattern: setup the external and internal system in a controlled, execute a behavior, and ensure the result of the behavior is expected. If the behavior has no returned result, we may verify the side effect manually
- **Isolation**: "Good" Communication
  - We typically don't write integration tests solely to verify behavior of real, local groups of code. The test will integrate with some external dependency, and utilize our real code to do so

# Integration Testing in ASP.NET Core
Now that there is a shared understanding of the taxonomy of an integration test, we can discuss how the approach might work in ASP.NET Core.

## E2E vs Integration Testing
Searching `ASP.NET Core Integration Test` will lead you to find many articles that talk about integration testing starting at the controller/HTTP level. I find this doesn't provide much differentiation from an end-to-end test (searching for `ASP.NET Core E2E Test` will actually give you similar-looking articles!).

Given that an E2E test in this context requires one to spin up an in-memory test server and form HTTP requests, and that such a webserver may complicate its request handling with various pieces of infrastructure and middleware before reaching the business logic, it often makes sense to directly invoke services. These tests establish confidence that the logic of the application past the web layer is sound, though it comes with the tradeoff of coupling such tests to the public API of your high level services.

Having both kinds of tests in your suite gives you the opportunity to test individual methods and interim states not possible with E2E tests, which execute endpoints in whole. Understand the pros and cons of each, and vary your amounts accordingly. 

## ASP.NET Core vs .NET Framework: Inverted
One key difference in the newer framework lies in embracing dependency injection via _Microsoft.Extensions.DependencyInjection_, which be seen in the framework itself with needs like configuration and HttpContext access done over injected interfaces.

Similarly, libraries which add functionality to your API will often do so in the form of additional service registrations via extension methods over `IServiceCollection`. These extension methods add various services provided by the library, with the library itself relying on IoC.

In summary:
- Our units for integration tests use IoC as a way of declaring their dependencies
- Configuration of services within the ASP.NET Core framework within the application use IoC
- Libraries use IoC to inject their services and configuration
- Infrastructure needs (logging, configuration) use IoC

## Bringing D.I. to Integration Tests
Given that the application is built on the concept of a D.I. framework supplying dependencies to services, controllers, middlewares, etc - it would likewise be essential to resolve our system under test via D.I.

Remember earlier that we established it is _necessary_ to faithfully test your codebase unmodified at-or-below your isolation level, thus our tests should seek to strictly mock undesired external calls. Moreover, since the configuration of our application/services is done via D.I., it is an easy choice to _reuse_ the D.I. initialization in our application - supplying it with test values where needed when configuring external services - than to attempt to manually recreate the various systems under test.

# Test Setup

## Creating the D.I. Container
Typically, service registration is achieved in the `Startup` class of your ASP.NET Core application. Minimal APIs and top-level statements have muddied this a bit, but extracting registration is an easy remedy (and possibly recommended to avoid minimal APIs altogether once the app hits a certain size - but, writing for another day).

Given our commitment to testing our code as whole as possible, we should execute all service registrations. There is a chance that registration of services can replace or otherwise modify existing services, and it is a _certainty_ that our application may use any injected service. Failure to register all services as is done in our application means that developers writing tests are responsible for faithfully recreating _any_ injectable object.

It becomes, then, an easy decision to reuse as much as possible our initialization logic and recreate a service collection just the same as is done in our `Startup` class. Fortunately, a mechanism exists to facilitate exactly this: either creating both the `Host` and `Server` with `WebApplicationFactory`, or _strictly_ creating the `Host` with `WebhostBuilder`. Both options let us customize the services and configuration, however the primary difference is that  `WebApplicationFactory` will recreate your server in-process, executing the entrypoint of your application. This is more expensive than simple service registration, and is unnecessary if you're not going to be executing tests against your controllers.

## Cleaning Up Resources
Part of the nature of a D.I. container is to not only facilitate creation, but also disposal of its created resources. The container itself also creates entities with a fixed lifetime, such as a scope within which to request scoped services. You should utilize your test framework's method for managing these resource's lifetimes appropriately.

## Creating the System Under Test
By simply resolving the SUT from the created test container, we have a trivial way to begin testing. We've massively simplified the `Arrange` phase of our test by removing all manual code regarding our SUT's creation, and we can begin arranging the test data to act/assert upon it.

# Demonstration
A fully functional application has been setup [here](https://github.com/svengeance/demo-integration-testing/tree/main). In it, we will find an ASP.NET Core API that talks to a 3'rd party API to save data to a database for later retrieval. The final portion of this article will delve into the architecture of the project and explain the integration testing, relating it to concepts previously mentioned.

## Testable Elements
The API features two key external interaction points: a 3'rd party API, and a database. Given the API is not owned resource we can spin up, testing _real_ calls to this API in integration tests is not ideal, however the database (sqlite) can be easily tested against.

## The Plan
Taking everything stated prior in this article into consideration, our integration test should be planned thusly:

- We wish to avoid manually recreating our systems under test
- We want our integration tested code to mimic _as much as possible_ our real system
- Avoid "Bad Communication"
- As always, we seek to minimize boilerplate and ease testing

## Reviewing the Execution
We'll break down the pieces of the example integration test that demonstate the article's concepts. At a high level, here are the big pieces of our framework:

- xUnit: Popular testing framework, albeit opinionated about its lifecycle and geared towards integration tests, albeit with an unfortunate reliance on constructors for shared test context
  - `IAsyncLifetime`: Asynchronously create and dispose of a resource, called before/after each test
  - `IClassFixture<TFixture>`: Ensure all tests in the same **class** share the same instance of `TFixture`, essentially creating `TFixture` once per class. Ideal for expensive initialization
  - xUnit Test Lifecycle: Constructors in a test class are called before each test, as is any code in `IAsyncLifetime`
- AutoFixture: Facilitates object creation, especially useful for creating objects whose constructors and nullability demand all properties are set despite our test only caring about a few specific ones. "Create an object, I don't care how, but set this property" is a way to express intent to future developers
- FluentAssertions: An assertion library; not very relevant for the article, but a preference nonetheless

### Mimicking Real Code
```cs
public class TestServices: IAsyncLifetime
{
    public IServiceProvider Services => _webApplication.Services;
    
    private readonly WebApplication _webApplication;
    
    public TestServices()
    {
        // Build our application exactly as is done in `Program`
        var webApplicationBuilder = WebApplication.CreateBuilder();

        // Inject any test-specific configuration needed
        ConfigureTestConfiguration(webApplicationBuilder.Configuration);

        // Register all of our application services
        webApplicationBuilder.Services.AddApplicationServices(webApplicationBuilder.Configuration);

        // Inject/override any test-specific services
        ConfigureTestServices(webApplicationBuilder.Services);
        
        // Create our app and hold onto it so it can be disposed
        _webApplication = webApplicationBuilder.Build();
    }

    private static void ConfigureTestServices(IServiceCollection services)
    {   
        // Replace a "bad communication" call with a stub.
        services.Replace(ServiceDescriptor.Scoped<IWeatherApiService, WeatherApiServiceStub>());
    }

    private static void ConfigureTestConfiguration(IConfigurationBuilder builder)
        => builder.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:WeatherDb"] = "DataSource=weatherdb_test.sqlite"
        });

    public Task InitializeAsync()
        => Task.CompletedTask;

    public async Task DisposeAsync()
        => await _webApplication.DisposeAsync();
}
```

This represents our `TFixture` that will be shared among all tests in a class. The test configuration may read a file such as user secrets or appsettings, so we opt to do this less frequently than for every unique test case. The configuration added in `ConfigureTestConfiguration` is picked up by our application's extension `AddApplicationServices`, giving us a chance to configure test data any way we choose, perhaps user secrets for shared integration test databases, environment variables for our test runners, etc.

### Lifetimes and SUT Creation
```cs

public abstract class BaseIntegrationTest: IAsyncLifetime, IClassFixture<TestServices> // Share `TestServices` among all tests in the class
{
    protected IServiceScope ServiceScope { get; }
    protected WeatherContext WeatherContext { get; }
    protected Fixture Fixture { get; }
    
    public BaseIntegrationTest(TestServices testServices)
    {
        // AutoFixture instance for each test to avoid cross-contamination
        Fixture = new Fixture();
        // Fresh ServiceScope to resolve/dispose Scoped services
        ServiceScope = testServices.Services.CreateScope();
        // "Helper"/shortcut reference to our application's Context. Useful for whitebox/effectual testing to verify side effects
        WeatherContext = ServiceScope.ServiceProvider.GetRequiredService<WeatherContext>();
    }

    public async Task InitializeAsync()
    {
        // Reset our sqlite database to avoid cross-contamination of data.
        // Highly recommend `Respawn` (https://github.com/jbogard/Respawn) to facilitate this in MSSQL or Postgres
        await WeatherContext.Database.EnsureDeletedAsync();
        await WeatherContext.Database.EnsureCreatedAsync();
    }

    public Task DisposeAsync()
    {
        ServiceScope.Dispose();
        return Task.CompletedTask;
    }
}

// Facilitate creation of our SUT by providing a generic class
public abstract class BaseIntegrationTest<TSut> : BaseIntegrationTest where TSut : class
{
    protected TSut Sut { get; }

    protected BaseIntegrationTest(TestServices testServices) : base(testServices)
    {
        // Make the bold assumption that services are registered with a single interface. A source-generated approach might solve this better
        var serviceInterface = typeof(TSut).GetInterfaces().Single();
        // Create our system under test
        Sut = (TSut)ServiceScope.ServiceProvider.GetRequiredService(serviceInterface);
    }
}
```

Here we can see the creation of a base class which helps manage the lifecycle of our test resources. A large majority of APIs will be primarily concerned with database operations, so we seek to minimize difficult of accessing it by providing every integration test with the database.  
The generic test class lets us define our SUT, precluding the need to manually retrieve it for every integration test. **Note** that we leave our `ServiceScope` exposed - it is perhaps in a test's interest to verify side effects from other services' perspectives by retrieving and asserting against them after executing some action.

### The Test
```cs
public class WeatherReadingServiceTests: BaseIntegrationTest<WeatherReadingService>
{
    public WeatherReadingServiceTests(TestServices testServices) : base(testServices)
    { }

    [Fact]
    public async Task Save_reading_saves_to_database()
    {
        var reading = Fixture.Build<WeatherReading>().Without(w => w.Id).Create();

        var savedReading = await Sut.SaveReading(reading);

        savedReading.Id.Should().NotBe(0);
        savedReading.ConditionText.Should().Be(reading.ConditionText);
        savedReading.TimeOfReading.Should().Be(reading.TimeOfReading);
        savedReading.TemperatureFahrenheit.Should().Be(reading.TemperatureFahrenheit);
    }
    
    [Fact]
    public async Task Created_reading_can_be_retrieved()
    {
        var reading = Fixture.Build<WeatherReading>().Without(w => w.Id).Create();
        WeatherContext.WeatherReadings.Add(reading);
        await WeatherContext.SaveChangesAsync();

        var retrievedReading = await Sut.GetReading(reading.Id);

        retrievedReading.Id.Should().NotBe(0);
        retrievedReading.ConditionText.Should().Be(reading.ConditionText);
        retrievedReading.TimeOfReading.Should().Be(reading.TimeOfReading);
        retrievedReading.TemperatureFahrenheit.Should().Be(reading.TemperatureFahrenheit);
    }
}
```

Finally, the tests themselves. No boilerplate code (other than an unfortunate constructor) is present. Instead, we can get directly to writing our arrange/act/assertions. The lack of ceremony makes our tests easy to read **and** write, ~~perhaps regretfully~~ alleviating developers of excuses.

# Conclusion

## Closing thoughts
This article's intention is to express the importance of testing _real_ code, minimizing the setup _to_ test, and to offer a reasonable demonstration of how this can be done.

## TLDR
I get it, no hard feelings - brevity is, perhaps, not my strongsuit.

**Integration Tests _Should_**:
- Test real, production code; don't fake it or take shortcuts
- Test your system against zero or more external systems
- For ASP.NET Core, have an entrypoint that is either at the HTTP level (E2E Integration Testing) or top-level services
- Only create [test doubles](https://www.educative.io/answers/what-is-faking-vs-mocking-vs-stubbing) for calls to uncontrollable 3'rd party services
- Alleviate developers from as much boilerplate as possible by managing lifecycle and creation of resources

See [The demo-integration-testing repo](https://github.com/svengeance/demo-integration-testing/) for an example.

Thank you for staying with me. Have a great day, drink water, and enjoy the little things.