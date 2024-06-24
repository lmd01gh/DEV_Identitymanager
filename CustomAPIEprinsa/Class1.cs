#region Copyright 2023 One Identity LLC.
/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2023 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */
#endregion

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Threading;
using System.Threading.Tasks;
using QBM.CompositionApi.ApiManager;
using QBM.CompositionApi.Captcha;
using QBM.CompositionApi.Config;
using QBM.CompositionApi.Crud;
using QBM.CompositionApi.Definition;
using QBM.CompositionApi.Handling;
using QBM.CompositionApi.PlugIns;
using QBM.CompositionApi.Session;
using QER.CompositionApi.QueueQuery;
using VI.Base;
using VI.Base.Logging;
using VI.DB.Entities;
using VI.DB.Scripting;
using NLog;

using System.Net.Http;
using VI.DB;
using VI.DB.Compatibility;
using System.Security.Cryptography;
using VI.DB.Implementation;
using VI.DB.Sync;
using System.Reflection.Emit;
using VI.DB.JobGeneration;
using QBM.CompositionApi.DataSources;

//[assembly: QBM.CompositionApi.PlugIns.Module("CCC")]

[assembly: Module("CCC")]

// This attribute will automatically assign all methods defined by this DLL
// to the CCC module.


namespace QBM.CompositionApi
{

    public class PluginMethodSetProvider : IPlugInMethodSetProvider
    {
        public IMethodSetProvider Build(IResolve resolver)
        {
            return new customeprinsa(resolver);
        }
        //}


        internal class customeprinsa : IMethodSetProvider
        {


            private readonly IResolve _resolver;
            //private readonly MethodSet _project;

            public customeprinsa(IResolve resolver)
            {
                _resolver = resolver;
            }

            public Task<IEnumerable<IMethodSet>> GetMethodSetsAsync(CancellationToken ct = new CancellationToken())
            {
                var methodSet = new MethodSet
                {
                    AppId = "customeprinsa",
                    // SessionConfig = new SessionAuthDbConfig
                    //{
                    //   AuthenticationType = AuthType.AllManualModules,
                    //   Product = "Customeprinsa"
                    //}
                    SessionConfig = new SessionAuthDbConfig { AuthenticationType = AuthType.FixedCredentials }
                };

                // Include all classes in this assembly that implement IApiProvider
                methodSet.Configure(_resolver, Assembly.GetExecutingAssembly().GetTypes()
                        .Where(t => typeof(IApiProvider).IsAssignableFrom(t))
                       .OrderBy(t => t.FullName)
                        .Select(t => (IApiProvider)t.GetConstructor(new Type[0]).Invoke(new object[0])));

                return Task.FromResult<IEnumerable<IMethodSet>>(new[]
                {
                methodSet
            });
            }






        }





        public class APIEprinsaCustom : IApiProviderFor<customeprinsa>
        {
            private static readonly NLog.Logger Logger = LogManager.GetLogger(LogNames.WebLog);
            public async Task<string> VerifyAsync(IRequest request, string captchaCode, CancellationToken ct = default)
            {

                var errorMessage = await request.MethodSet.Services.Resolve<ICaptchaValidator>().ValidateAsync(captchaCode, null, request, ct)
                    .ConfigureAwait(false);
                if (errorMessage != null)
                {

                    return "0";


                }
                else
                {
                    //captcha test passed
                    return "1";
                }
            }

            public void Build(IApiBuilder builder)
            {
                // This method takes two string parameters and returns a string.
                // For demonstration purposes, the method simply calls the script
                // VI_BuildInitials.



                builder.AddMethod(Method.Define("ccc/SolicitudOTP")
                   //.AllowUnauthenticated()
                   .WithParameter("OTP_Usuario", typeof(string), isInQuery: true)
                   .WithParameter("OTP_EnviarA", typeof(string), isInQuery: true)
                   .HandleGet(qr =>
                   {
                       // Setup the script runner
                       var scriptClass = qr.Session.Scripts().GetScriptClass(ScriptContext.Scripts);
                       var runner = new ScriptRunner(scriptClass, qr.Session);

                       // Add any script input parameters to this array.
                       // In this example, the script parameters are defined as
                       // URL parameters, and their values must be supplied
                       // by the client. This does not have to be the case.
                       var parameters = new object[]
                       {
                        qr.Parameters.Get<string>("OTP_Usuario"),
                        qr.Parameters.Get<string>("OTP_EnviarA")
                       };

                       // This assumes that the script returns a string.
                       return runner.Eval("CCC_EPRINSA_SolicitudOTP", parameters) as string;
                   }));


                builder.AddMethod(Method.Define("ccc/CompruebaCaptcha")
                  .WithParameter("Codigo", typeof(string))
                  .HandleGet(async qr =>
                  {


                      var captcha = qr.Parameters.Get<string>("Codigo");

                      return await VerifyAsync(qr, captcha);


                      //return "You sent the parameter: " + captcha;



                  }));
                

                builder.AddMethod(Method.Define("ccc/PoliticaPassword/columnas")
                     .FromTable("qbmpwdpolicy")
                     .EnableRead()
                     // Only include specific columns in the result.

                     .WithResultColumns("displayname", "MinLen", "MaxLen", "specialcharsDenied", "historyLen"));

                builder.ModifyQueryMethod(
                // This is the URL of the method to be extended.
                "ccc/PoliticaPassword/columnas",
                method =>
                {
                    method.WhereClauseProviders.Add(new WhereClauseProvider((qr, whereClause) =>

                    // add another condition using "AND" operator
                    qr.Session.SqlFormatter().AndRelation(whereClause, "uid_QBMPwdPolicy='QER-45c850c9612242a08796e9068c43a49d'")));
                });


                

            }


    


        }
    }
    
}

